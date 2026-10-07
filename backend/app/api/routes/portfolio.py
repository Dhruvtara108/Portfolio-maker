from pathlib import PurePath

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from pydantic import ValidationError

from app.schemas.portfolio import CandidateInfo, PortfolioDraftResponse
from app.services.portfolio import create_portfolio_draft

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

MAX_FILE_SIZE = 10 * 1024 * 1024
RESUME_EXTENSIONS = {".pdf", ".docx"}
JOB_DESCRIPTION_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/draft", response_model=PortfolioDraftResponse)
async def create_draft(
    full_name: str = Form(...),
    professional_headline: str = Form(...),
    email: str = Form(...),
    phone: str = Form(""),
    location: str = Form(""),
    about: str = Form(""),
    linkedin_url: str = Form(""),
    github_url: str = Form(""),
    website_url: str = Form(""),
    resume: UploadFile = File(...),
    job_description_text: str = Form(""),
    job_description_file: UploadFile | None = File(None),
) -> PortfolioDraftResponse:
    try:
        candidate = CandidateInfo(
            full_name=full_name.strip(),
            professional_headline=professional_headline.strip(),
            email=email.strip(),
            phone=phone.strip(),
            location=location.strip(),
            about=about.strip(),
            linkedin_url=linkedin_url.strip() or None,
            github_url=github_url.strip() or None,
            website_url=website_url.strip() or None,
        )
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=exc.errors(),
        ) from exc

    resume_size = await validate_upload(resume, RESUME_EXTENSIONS, "resume")
    job_description_value = job_description_text.strip()
    if bool(job_description_value) == bool(job_description_file):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Provide either job_description_text or job_description_file, but not both.",
        )

    job_description_filename = None
    if job_description_file:
        await validate_upload(job_description_file, JOB_DESCRIPTION_EXTENSIONS, "job description")
        job_description_filename = job_description_file.filename

    return create_portfolio_draft(
        candidate=candidate,
        resume_filename=resume.filename or "resume",
        resume_size=resume_size,
        job_description_source="file" if job_description_file else "text",
        job_description_filename=job_description_filename,
    )


async def validate_upload(
    upload: UploadFile,
    allowed_extensions: set[str],
    label: str,
) -> int:
    filename = upload.filename or ""
    extension = PurePath(filename).suffix.lower()
    if extension not in allowed_extensions:
        allowed = ", ".join(sorted(allowed_extensions))
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid {label} file type. Allowed types: {allowed}.",
        )

    content = await upload.read(MAX_FILE_SIZE + 1)
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"The {label} must not exceed 10 MB.",
        )

    if extension == ".pdf" and not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"The {label} does not contain a valid PDF file.",
        )
    if extension == ".docx" and not content.startswith(b"PK"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"The {label} does not contain a valid DOCX file.",
        )

    return len(content)
