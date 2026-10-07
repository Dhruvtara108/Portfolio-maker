from pydantic import AnyHttpUrl, BaseModel, EmailStr, Field


class CandidateInfo(BaseModel):
    full_name: str = Field(min_length=1)
    professional_headline: str = Field(min_length=1)
    email: EmailStr
    phone: str = ""
    location: str = ""
    about: str = ""
    linkedin_url: AnyHttpUrl | None = None
    github_url: AnyHttpUrl | None = None
    website_url: AnyHttpUrl | None = None


class DocumentMetadata(BaseModel):
    filename: str
    size: int
    extracted: bool
    text_length: int


class JobDescriptionMetadata(BaseModel):
    source: str
    filename: str | None = None
    extracted: bool
    text_length: int


class PortfolioDraftResponse(BaseModel):
    success: bool
    message: str
    candidate: dict[str, str]
    resume: DocumentMetadata
    job_description: JobDescriptionMetadata
