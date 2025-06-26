-- Mengubah kolom workHours dari NULL ke NOT NULL dengan nilai default
UPDATE contact_info SET workHours = 'Senin - Jumat: 09:00 - 21:00' WHERE workHours IS NULL;
ALTER TABLE contact_info MODIFY workHours VARCHAR(191) NOT NULL;
