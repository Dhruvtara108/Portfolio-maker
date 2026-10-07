from io import BytesIO

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
PDF = b"%PDF-1.7\nminimal test content"
DOCX = b"PK\x03\x04minimal docx content"


def candidate_fields(**overrides: str) -> dict[str, str]:
    fields = {
        "full_name": "Alex Morgan",
        "professional_headline": "Product Designer",
        "email": "alex@example.com",
        "phone": "",
        "location": "New York",
        "about": "Designer focused on useful products.",
        "linkedin_url": "https://linkedin.com/in/alex",
        "github_url": "https://github.com/alex",
        "website_url": "",
        "job_description_text": "We are looking for a product designer.",
    }
    fields.update(overrides)
    return fields


def resume_file(content: bytes = PDF, filename: str = "resume.pdf"):
    return {"resume": (filename, BytesIO(content), "application/pdf")}


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_valid_portfolio_draft():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(),
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["resume"]["filename"] == "resume.pdf"


def test_missing_full_name():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(full_name=""),
        files=resume_file(),
    )
    assert response.status_code == 422


def test_missing_professional_headline():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(professional_headline=""),
        files=resume_file(),
    )
    assert response.status_code == 422


def test_invalid_resume_extension():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(PDF, "resume.txt"),
    )
    assert response.status_code == 422


def test_resume_larger_than_10_mb():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(b"%PDF-" + b"x" * (10 * 1024 * 1024)),
    )
    assert response.status_code == 413


def test_missing_job_description():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files=resume_file(),
    )
    assert response.status_code == 422


def test_invalid_job_description_file_type():
    data = candidate_fields(job_description_text="")
    response = client.post(
        "/api/portfolio/draft",
        data=data,
        files={
            **resume_file(),
            "job_description_file": ("jd.exe", BytesIO(b"MZ"), "application/octet-stream"),
        },
    )
    assert response.status_code == 422


def test_valid_job_description_text():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text="A role requiring design systems."),
        files=resume_file(),
    )
    assert response.status_code == 200
    assert response.json()["job_description"] == {"source": "text"}


def test_valid_job_description_file():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files={
            **resume_file(),
            "job_description_file": ("job-description.docx", BytesIO(DOCX), "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        },
    )
    assert response.status_code == 200
    assert response.json()["job_description"]["source"] == "file"
