import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import auth, models

router = APIRouter(prefix="/api/v1/upload", tags=["upload"])

# Save to frontend/public/uploads so Next.js can serve them statically
UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend", "public", "uploads"
)
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_SIZE_MB = 10

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Upload an image file. Returns the public URL to use in canvas."""
    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Read and check size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f}MB). Max allowed: {MAX_SIZE_MB}MB"
        )

    # Save with unique name
    unique_name = f"{uuid.uuid4().hex}{ext}"

    # Cloudinary Integration
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")
    public_url = ""

    if cloud_name and api_key and api_secret and "your_" not in cloud_name:
        try:
            import cloudinary
            import cloudinary.uploader
            
            cloudinary.config(
                cloud_name=cloud_name,
                api_key=api_key,
                api_secret=api_secret,
                secure=True
            )
            
            # Upload to Cloudinary
            response = cloudinary.uploader.upload(
                content,
                public_id=uuid.uuid4().hex,
                folder="mielove-uploads",
                resource_type="image"
            )
            public_url = response.get("secure_url")
        except Exception as e:
            print(f"Cloudinary upload failed: {e}")
            raise HTTPException(status_code=500, detail="Cloud upload failed. Please contact admin.")
    else:
        # Fallback to local storage
        save_path = os.path.join(UPLOAD_DIR, unique_name)
        with open(save_path, "wb") as f:
            f.write(content)
        public_url = f"/uploads/{unique_name}"
    return {
        "url": public_url,
        "filename": unique_name,
        "size_bytes": len(content),
        "message": "Upload successful"
    }


@router.delete("/image/{filename}")
def delete_image(
    filename: str,
    current_user: models.User = Depends(auth.get_current_user)
):
    """Delete an uploaded image by filename."""
    # Safety: only allow simple filenames, no path traversal
    if "/" in filename or "\\" in filename or ".." in filename:
        raise HTTPException(status_code=400, detail="Invalid filename")

    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    os.remove(file_path)
    return {"message": f"File '{filename}' deleted"}
