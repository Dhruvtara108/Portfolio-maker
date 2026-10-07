from app.schemas.portfolio import (
    CandidateInfo,
    DocumentMetadata,
    JobDescriptionMetadata,
    PortfolioDraftResponse,
)


def create_portfolio_draft(
    candidate: CandidateInfo,
    resume_filename: str,
    resume_size: int,
    resume_text_length: int,
    job_description_source: str,
    job_description_text_length: int,
    job_description_filename: str | None = None,
) -> PortfolioDraftResponse:
    return PortfolioDraftResponse(
        success=True,
        message="Portfolio draft received",
        candidate={
            "full_name": candidate.full_name,
            "professional_headline": candidate.professional_headline,
        },
        resume=DocumentMetadata(
            filename=resume_filename,
            size=resume_size,
            extracted=True,
            text_length=resume_text_length,
        ),
        job_description=JobDescriptionMetadata(
            source=job_description_source,
            filename=job_description_filename,
            extracted=True,
            text_length=job_description_text_length,
        ),
    )
