-- Create access_requests table
CREATE TABLE IF NOT EXISTS access_requests (
  request_id VARCHAR PRIMARY KEY,
  document_id INTEGER REFERENCES documents(document_id),
  organization_id INTEGER REFERENCES organizations(organization_id),
  student_id INTEGER REFERENCES students(enrolment_id),
  status VARCHAR DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  duration_hours INTEGER
); 