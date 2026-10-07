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


class PortfolioDraftResponse(BaseModel):
    success: bool
    message: str
    candidate: dict[str, str]
    resume: dict[str, str | int]
    job_description: dict[str, str]
