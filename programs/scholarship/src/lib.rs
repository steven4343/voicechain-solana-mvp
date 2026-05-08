use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("SCHOLARSHIP_PROGRAM_ID_REPLACE_ME");

#[program]
pub mod scholarship {
    use super::*;

    pub fn initialize_scholarship(
        ctx: Context<InitializeScholarship>,
        name: String,
        description: String,
        student: Pubkey,
        total_amount: u64,
        milestones: Vec<MilestoneInput>,
    ) -> Result<()> {
        let scholarship = &mut ctx.accounts.scholarship;
        scholarship.admin = ctx.accounts.admin.key();
        scholarship.student = student;
        scholarship.name = name;
        scholarship.description = description;
        scholarship.total_amount = total_amount;
        scholarship.funded_amount = 0;
        scholarship.is_active = true;
        scholarship.milestone_count = milestones.len() as u8;
        scholarship.bump = ctx.bumps.scholarship;

        for (i, m) in milestones.iter().enumerate() {
            let milestone = &mut ctx.accounts.milestones[i];
            milestone.scholarship = ctx.accounts.scholarship.key();
            milestone.description = m.description.clone();
            milestone.amount = m.amount;
            milestone.is_approved = false;
            milestone.is_completed = false;
            milestone.approval_count = 0;
            milestone.bump = ctx.bumps.milestones[i];
        }

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, _scholarship_id: u64, amount: u64) -> Result<()> {
        let scholarship = &mut ctx.accounts.scholarship;
        require!(scholarship.is_active, ScholarshipError::ScholarshipInactive);

        let cpi_accounts = Transfer {
            from: ctx.accounts.donator.to_account_info(),
            to: ctx.accounts.scholarship_vault.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, amount)?;

        scholarship.funded_amount = scholarship.funded_amount.checked_add(amount).unwrap();

        Ok(())
    }

    pub fn approve_milestone(ctx: Context<ApproveMilestone>, _milestone_index: u8) -> Result<()> {
        let milestone = &mut ctx.accounts.milestone;
        require!(!milestone.is_approved, ScholarshipError::MilestoneAlreadyApproved);

        milestone.approval_count = milestone.approval_count.checked_add(1).unwrap();

        let required_approvals = (milestone.approval_count >= 2);
        if required_approvals {
            milestone.is_approved = true;
        }

        Ok(())
    }

    pub fn complete_milestone(ctx: Context<CompleteMilestone>) -> Result<()> {
        let milestone = &mut ctx.accounts.milestone;
        require!(milestone.is_approved, ScholarshipError::MilestoneNotApproved);
        milestone.is_completed = true;
        Ok(())
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>) -> Result<()> {
        let scholarship = &ctx.accounts.scholarship;
        let vault = &ctx.accounts.scholarship_vault;

        require!(
            vault.lamports() >= scholarship.total_amount,
            ScholarshipError::InsufficientFunds
        );

        let cpi_accounts = Transfer {
            from: vault.to_account_info(),
            to: ctx.accounts.student.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_ctx, scholarship.total_amount)?;

        Ok(())
    }

    #[derive(Accounts)]
    #[instruction(name: String, description: String, student: Pubkey, total_amount: u64, milestones: Vec<MilestoneInput>)]
    pub struct InitializeScholarship<'info> {
        #[account(mut)]
        pub admin: Signer<'info>,
        #[account(
            init,
            payer = admin,
            space = 8 + 32 + 32 + 64 + 64 + 64 + 1 + 1 + 1 + 8 + 1,
            seeds = [b"scholarship", name.as_bytes()],
            bump
        )]
        pub scholarship: Account<'info, ScholarshipAccount>,
        #[account(mut)]
        pub scholarship_vault: SystemAccount<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    #[instruction(_scholarship_id: u64, amount: u64)]
    pub struct Donate<'info> {
        #[account(mut)]
        pub donator: Signer<'info>,
        #[account(mut, has_one = student)]
        pub scholarship: Account<'info, ScholarshipAccount>,
        #[account(mut)]
        pub scholarship_vault: SystemAccount<'info>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    #[instruction(_milestone_index: u8)]
    pub struct ApproveMilestone<'info> {
        #[account(mut)]
        pub committee_member: Signer<'info>,
        #[account(mut, has_one = scholarship)]
        pub milestone: Account<'info, MilestoneAccount>,
        pub scholarship: Account<'info, ScholarshipAccount>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct CompleteMilestone<'info> {
        #[account(mut)]
        pub admin: Signer<'info>,
        #[account(mut, has_one = scholarship)]
        pub milestone: Account<'info, MilestoneAccount>,
        pub scholarship: Account<'info, ScholarshipAccount>,
        pub system_program: Program<'info, System>,
    }

    #[derive(Accounts)]
    pub struct WithdrawFunds<'info> {
        #[account(mut)]
        pub student: Signer<'info>,
        #[account(has_one = student)]
        pub scholarship: Account<'info, ScholarshipAccount>,
        #[account(mut)]
        pub scholarship_vault: SystemAccount<'info>,
        pub system_program: Program<'info, System>,
    }
}

#[account]
pub struct ScholarshipAccount {
    pub admin: Pubkey,
    pub student: Pubkey,
    pub name: String,
    pub description: String,
    pub total_amount: u64,
    pub funded_amount: u64,
    pub is_active: bool,
    pub milestone_count: u8,
    pub bump: u8,
}

#[account]
pub struct MilestoneAccount {
    pub scholarship: Pubkey,
    pub description: String,
    pub amount: u64,
    pub is_approved: bool,
    pub is_completed: bool,
    pub approval_count: u8,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MilestoneInput {
    pub description: String,
    pub amount: u64,
}

#[error_code]
pub enum ScholarshipError {
    #[msg("Scholarship is not active")]
    ScholarshipInactive,
    #[msg("Milestone already approved")]
    MilestoneAlreadyApproved,
    #[msg("Milestone not yet approved")]
    MilestoneNotApproved,
    #[msg("Insufficient funds in vault")]
    InsufficientFunds,
}
