from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from typing import Optional
from datetime import datetime
from app.config import settings

def send_email(email: str, download_link: Optional[str], name: str, job_id: str) -> None:
    """Original GlycoShield email function"""
    if not (settings.SMTP_SERVER and settings.SMTP_USER and settings.SMTP_PASSWORD):
        return  # emailing disabled if creds not set

    msg = MIMEMultipart()
    msg["From"] = settings.EMAIL_FROM or settings.SMTP_USER
    msg["To"] = email
    msg["Subject"] = settings.EMAIL_SUBJECT

    results_page_url = f"{settings.FRONTEND_URL}/results?jobId={job_id}&resultUrl={download_link or ''}"
    body = f"""Hello {name},

Your file has been successfully processed.

Direct download: {download_link or 'N/A'}
Viewer: {results_page_url}

Best regards,
SimBioSys Lab, Northeastern University"""
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.sendmail(msg["From"], [email], msg.as_string())


def send_vasco_email(
    action: str,
    email: str,
    name: str,
    user_id: str,
    job_id: str,
    azure_url: str,
    duration: Optional[str] = None
) -> None:
    """
    Send VASCO job notification emails.
    
    Args:
        action: "started" or "completed"
        email: Recipient email address
        name: User name
        user_id: Job/User ID
        job_id: Process ID or SLURM job ID
        azure_url: Azure results URL
        duration: Job duration (for completed emails)
    """
    if not (settings.SMTP_SERVER and settings.SMTP_USER and settings.SMTP_PASSWORD):
        return  # emailing disabled if creds not set
    
    if not email or not email.strip():
        return  # No email provided
    
    msg = MIMEMultipart('alternative')
    
    from_name = getattr(settings, 'EMAIL_FROM_NAME', 'GLACIER - SimBioSys Lab')
    from_email = settings.EMAIL_FROM or settings.SMTP_USER
    
    msg['From'] = f"{from_name} <{from_email}>"
    msg['To'] = email
    
    if action == "started":
        msg['Subject'] = f"VASCO Analysis Started - Job {user_id[:8]}"
        
        # Plain text version
        text_content = f"""
VASCO Analysis Started

Dear {name or 'Researcher'},

Your VASCO (Viral Antibody Structural Complex Analysis) job has been submitted successfully and is now processing.

Job Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Job ID:         {user_id}
Process ID:     {job_id}
Submitted:      {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
Status:         Processing

Results URL:    {azure_url}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pipeline Stages:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Combining PDB files
2. Extracting chains
3. MSA generation (2-4 hours) ⏰
4. Neural network prediction
5. Generating visualizations

Estimated Time: 4-8 hours
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What's Next:
• Your job is now running on the HPC login node
• The results page will update automatically as processing completes
• You'll receive another email when analysis is complete
• You can check the status at: {azure_url}

Need Help?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contact: simbiosyslab.neu@gmail.com
Documentation: https://glacier.simbiosys.org/docs/vasco

---
GLACIER - SimBioSys Lab, Northeastern University
This is an automated notification from the VASCO pipeline.
"""
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #fafafa;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
            line-height: 1.6;
        }}
        .container {{
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.08);
            overflow: hidden;
        }}
        .header {{
            background: #1a1a1a;
            color: white;
            padding: 30px;
            text-align: center;
        }}
        .header h1 {{
            margin: 0;
            font-size: 1.8em;
            font-weight: 600;
        }}
        .header p {{
            margin: 8px 0 0 0;
            opacity: 0.9;
            font-size: 0.95em;
        }}
        .content {{
            padding: 30px;
        }}
        .info-box {{
            background: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }}
        .info-row {{
            display: flex;
            margin-bottom: 10px;
            font-size: 0.9em;
        }}
        .info-label {{
            font-weight: 600;
            width: 130px;
            color: #666;
        }}
        .info-value {{
            color: #1a1a1a;
            word-break: break-all;
        }}
        .btn {{
            display: inline-block;
            background: #1a1a1a;
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
        }}
        .footer {{
            background: #f5f5f5;
            padding: 20px 30px;
            text-align: center;
            color: #999;
            font-size: 0.85em;
            border-top: 1px solid #e0e0e0;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ VASCO Analysis Started</h1>
            <p>Viral Antibody Structural Complex Analysis</p>
        </div>
        
        <div class="content">
            <p>Dear {name or 'Researcher'},</p>
            
            <p>Your VASCO job has been submitted successfully and is now processing.</p>
            
            <div class="info-box">
                <div class="info-row">
                    <div class="info-label">Job ID:</div>
                    <div class="info-value">{user_id}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Process ID:</div>
                    <div class="info-value">{job_id}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Submitted:</div>
                    <div class="info-value">{datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">Status:</div>
                    <div class="info-value">Processing</div>
                </div>
            </div>
            
            <p><strong>⏱️ Estimated Time: 4-8 hours</strong></p>
            
            <div style="text-align: center;">
                <a href="{azure_url}" class="btn">View Results Page</a>
            </div>
            
            <p style="font-size: 0.9em; color: #666;">The results page will update automatically as processing completes. You'll receive another email when analysis is finished.</p>
        </div>
        
        <div class="footer">
            <p><strong>GLACIER</strong> - SimBioSys Lab, Northeastern University</p>
        </div>
    </div>
</body>
</html>
"""
        
    elif action == "completed":
        msg['Subject'] = f"VASCO Analysis Complete - Job {user_id[:8]}"
        
        duration_text = f"Duration: {duration}" if duration else ""
        
        # Plain text version
        text_content = f"""
VASCO Analysis Complete

Dear {name or 'Researcher'},

Your VASCO analysis has completed successfully! Your results are now ready to view.

Job Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Job ID:         {user_id}
Process ID:     {job_id}
Status:         ✓ Complete
{duration_text}

View Results:   {azure_url}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Results Include:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• predictions.csv - Per-residue interface predictions
• heatmap.png - Visualization of paratope predictions
• SUMMARY.txt - Analysis summary and statistics
• Supporting files - PDB chains, MSA data, embeddings

---
GLACIER - SimBioSys Lab, Northeastern University
"""
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fafafa; margin: 0; padding: 20px; }}
        .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }}
        .header {{ background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ padding: 30px; }}
        .btn {{ display: inline-block; background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; }}
        .footer {{ background: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 0.85em; border-radius: 0 0 8px 8px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ VASCO Analysis Complete</h1>
        </div>
        <div class="content">
            <p>Dear {name or 'Researcher'},</p>
            <p>Your VASCO analysis has completed successfully!</p>
            <p><strong>Job ID:</strong> {user_id}<br>
            <strong>Status:</strong> Complete{f'<br><strong>Duration:</strong> {duration}' if duration else ''}</p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="{azure_url}" class="btn">View Your Results</a>
            </div>
        </div>
        <div class="footer">
            <p><strong>GLACIER</strong> - SimBioSys Lab, Northeastern University</p>
        </div>
    </div>
</body>
</html>
"""
    
    else:
        raise ValueError(f"Invalid action: {action}")
    
    # Attach both versions
    msg.attach(MIMEText(text_content, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_content, 'html', 'utf-8'))
    
    # Send email
    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
