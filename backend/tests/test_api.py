from io import BytesIO

import fitz
from docx import Document
from fastapi.testclient import TestClient

from app.main import app
from app.services.extraction import (
    extract_docx_text,
    extract_file_text,
    extract_pdf_text,
    extract_txt_text,
    normalize_text,
)

client = TestClient(app)


def make_pdf(text: str) -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), text)
    content = document.tobytes()
    document.close()
    return content


def make_docx(text: str) -> bytes:
    document = Document()
    document.add_paragraph(text)
    output = BytesIO()
    document.save(output)
    return output.getvalue()


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


def resume_file(content: bytes | None = None, filename: str = "resume.pdf"):
    return {"resume": (filename, BytesIO(content or make_pdf("Resume experience")), "application/pdf")}


def test_pdf_text_extraction():
    assert "Resume experience" in extract_pdf_text(make_pdf("Resume experience"))


def test_docx_text_extraction():
    assert extract_docx_text(make_docx("DOCX experience")) == "DOCX experience"


def test_txt_extraction():
    assert extract_txt_text(b"TXT experience") == "TXT experience"


def test_text_normalization():
    assert normalize_text("  first\r\n second\x00 \n\n third  ") == "first\nsecond\n\nthird"


def test_empty_document_rejected():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(make_pdf("")),
    )
    assert response.status_code == 422
    assert "no extractable text" in response.json()["detail"]


def test_unsupported_file_rejected():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(b"plain", "resume.txt"),
    )
    assert response.status_code == 422
    assert "Invalid resume file type" in response.json()["detail"]


def test_corrupt_pdf_handling():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(b"%PDF-corrupt"),
    )
    assert response.status_code == 422
    assert "Could not read PDF file" in response.json()["detail"]


def test_corrupt_docx_handling():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files={
            **resume_file(),
            "job_description_file": ("jd.docx", BytesIO(b"PK\x03\x04not a docx"), "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        },
    )
    assert response.status_code == 422
    assert "Could not read DOCX file" in response.json()["detail"]


def test_valid_resume_extraction_through_draft():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(),
        files=resume_file(make_pdf("Resume experience")),
    )
    assert response.status_code == 200
    assert response.json()["resume"]["extracted"] is True
    assert response.json()["resume"]["text_length"] > 0


def test_valid_job_description_pdf_extraction():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files={
            **resume_file(),
            "job_description_file": ("jd.pdf", BytesIO(make_pdf("PDF job description")), "application/pdf"),
        },
    )
    assert response.status_code == 200
    assert response.json()["job_description"]["source"] == "file"
    assert response.json()["job_description"]["text_length"] > 0


def test_valid_job_description_docx_extraction():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files={
            **resume_file(),
            "job_description_file": ("jd.docx", BytesIO(make_docx("DOCX job description")), "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
        },
    )
    assert response.status_code == 200
    assert response.json()["job_description"]["text_length"] > 0


def test_valid_job_description_txt_extraction():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text=""),
        files={
            **resume_file(),
            "job_description_file": ("jd.txt", BytesIO(b"TXT job description"), "text/plain"),
        },
    )
    assert response.status_code == 200
    assert response.json()["job_description"]["text_length"] == len("TXT job description")


def test_pasted_job_description_extraction():
    response = client.post(
        "/api/portfolio/draft",
        data=candidate_fields(job_description_text="  Pasted\r\n job description  "),
        files=resume_file(),
    )
    assert response.status_code == 200
    assert response.json()["job_description"] == {
        "source": "text",
        "filename": None,
        "extracted": True,
        "text_length": len("Pasted\njob description"),
    }


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
