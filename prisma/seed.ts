import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash,
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin.username);

  // First check if any contact info exists
  const existingContact = await prisma.contactInfo.findFirst();
  
  let contactInfo;
  if (existingContact) {
    // Update existing contact info
    contactInfo = await prisma.contactInfo.update({
      where: { id: existingContact.id },
      data: {
        phone: "081225510099",
        email: "halo@fhsolusidigital.id",
        address: "Karangmiri, UH 7 Gg. Cinde Amoh No.317C, Giwangan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55163",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.6270047750663!2d110.39021127575067!3d-7.829243077770992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a572b1bfabf29%3A0x873a57d24e38feb4!2sANSAC%20(Anagata%20Sasmitaloka%20Consulting)!5e0!3m2!1sid!2sid!4v1750823086282!5m2!1sid!2sid",
        instagram: "https://www.instagram.com/fhds.id?igsh=MTh3aWM0bTBmZmRnNQ%3D%3D&utm_source=qr",
        whatsApp: "https://wa.me/6281225510099",
        workHours: "Senin - Jumat: 09:00 - 21:00",
      },
    });
  } else {
    // Create new contact info
    contactInfo = await prisma.contactInfo.create({
      data: {
        phone: "081225510099",
        email: "halo@fhsolusidigital.id",
        address: "Karangmiri, UH 7 Gg. Cinde Amoh No.317C, Giwangan, Kec. Umbulharjo, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55163",
        map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.6270047750663!2d110.39021127575067!3d-7.829243077770992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a572b1bfabf29%3A0x873a57d24e38feb4!2sANSAC%20(Anagata%20Sasmitaloka%20Consulting)!5e0!3m2!1sid!2sid!4v1750823086282!5m2!1sid!2sid",
        instagram: "https://www.instagram.com/fhds.id?igsh=MTh3aWM0bTBmZmRnNQ%3D%3D&utm_source=qr",
        whatsApp: "https://wa.me/6281225510099",
        workHours: "Senin - Jumat: 09:00 - 21:00",
      },
    });
  }

  console.log('Contact info created/updated:', contactInfo.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
