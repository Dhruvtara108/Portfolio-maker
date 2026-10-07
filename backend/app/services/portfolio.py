from app.schemas.portfolio import CandidateInfo, PortfolioDraftResponse


def create_portfolio_draft(
    candidate: CandidateInfo,
    resume_filename: str,
    resume_size: int,
    job_description_source: str,
    job_description_filename: str | None = None,
) -> PortfolioDraftResponse:
    job_description: dict[str, str] = {"source": job_description_source}
    if job_description_filename:
        job_description["filename"] = job_description_filename

    return PortfolioDraftResponse(
        success=True,
        message="Portfolio draft received",
        candidate={
            "full_name": candidate.full_name,
            "professional_headline": candidate.professional_headline,
        },
        resume={"filename": resume_filename, "size": resume_size},
        job_description=job_description,
    )
