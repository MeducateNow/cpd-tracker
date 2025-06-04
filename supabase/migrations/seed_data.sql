/*
  # Seed data for CPD tracking application

  1. Sample Data
    - Sample webinars with different categories and CPD points
    - Sample accreditation bodies
*/

-- Insert sample webinars
INSERT INTO webinars (title, description, presenter, date, duration_minutes, cpd_points, accreditation_body, category, image_url)
VALUES
  (
    'Advanced Cardiac Life Support Update',
    'Learn the latest guidelines and techniques for advanced cardiac life support in emergency situations.',
    'Dr. Sarah Johnson',
    NOW() + INTERVAL '7 days',
    120,
    4,
    'Medical Council',
    'Emergency Medicine',
    'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg'
  ),
  (
    'Ethical Considerations in Telemedicine',
    'Explore the ethical challenges and considerations when practicing medicine through telehealth platforms.',
    'Prof. Michael Chen',
    NOW() + INTERVAL '14 days',
    90,
    3,
    'Ethics Board',
    'Medical Ethics',
    'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg'
  ),
  (
    'Updates in Pharmacotherapy',
    'Review the latest developments in drug therapies and treatment protocols across various medical specialties.',
    'Dr. Emily Rodriguez',
    NOW() + INTERVAL '21 days',
    150,
    5,
    'Pharmacy Board',
    'Pharmacology',
    'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'
  ),
  (
    'Mental Health First Aid for Healthcare Professionals',
    'Learn essential skills to identify and support patients experiencing mental health challenges.',
    'Dr. James Wilson',
    NOW() + INTERVAL '10 days',
    180,
    6,
    'Mental Health Commission',
    'Psychiatry',
    'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg'
  ),
  (
    'Advances in Medical Imaging',
    'Discover the latest technologies and techniques in diagnostic imaging and their clinical applications.',
    'Dr. Lisa Thompson',
    NOW() + INTERVAL '30 days',
    120,
    4,
    'Radiology Society',
    'Radiology',
    'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg'
  ),
  (
    'Infection Control in Healthcare Settings',
    'Learn best practices for preventing and controlling infections in various healthcare environments.',
    'Dr. Robert Garcia',
    NOW() + INTERVAL '15 days',
    90,
    3,
    'Infection Control Board',
    'Infectious Disease',
    'https://images.pexels.com/photos/3952240/pexels-photo-3952240.jpeg'
  ),
  (
    'Pediatric Emergency Care',
    'Update your knowledge on managing pediatric emergencies with the latest evidence-based approaches.',
    'Dr. Maria Sanchez',
    NOW() + INTERVAL '25 days',
    150,
    5,
    'Pediatric Society',
    'Pediatrics',
    'https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg'
  ),
  (
    'Geriatric Medicine Update',
    'Explore current approaches to managing common conditions in elderly patients.',
    'Dr. William Brown',
    NOW() + INTERVAL '18 days',
    120,
    4,
    'Geriatric Medicine Society',
    'Geriatrics',
    'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg'
  );

-- Insert sample accreditation bodies
INSERT INTO accreditation_bodies (name, website_url, logo_url, submission_url, description)
VALUES
  (
    'Medical Council',
    'https://example.com/medical-council',
    NULL,
    'https://example.com/medical-council/submit',
    'The Medical Council is responsible for maintaining the register of medical practitioners and ensuring high standards in medical education, training, and practice.'
  ),
  (
    'Nursing and Midwifery Board',
    'https://example.com/nursing-board',
    NULL,
    'https://example.com/nursing-board/submit',
    'The Nursing and Midwifery Board regulates the practice of nursing and midwifery to protect the public and ensure high standards of care.'
  ),
  (
    'Pharmacy Board',
    'https://example.com/pharmacy-board',
    NULL,
    'https://example.com/pharmacy-board/submit',
    'The Pharmacy Board is responsible for registering pharmacists and setting standards for pharmacy practice to ensure the safe and effective delivery of pharmacy services.'
  ),
  (
    'Dental Council',
    'https://example.com/dental-council',
    NULL,
    'https://example.com/dental-council/submit',
    'The Dental Council regulates dental professionals to ensure they meet and maintain professional standards for the protection of the public.'
  );
