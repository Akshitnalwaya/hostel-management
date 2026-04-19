/**
 * Seed script: creates initial hostels, rooms, and an admin account.
 * Run once: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const Manager = require('./models/Manager');

const HOSTELS = [
  { name: 'A', type: 'attached', feePerYear: 75000, floors: 4, roomsPerFloor: 25, bedsPerRoom: 3 },
  { name: 'B', type: 'attached', feePerYear: 75000, floors: 4, roomsPerFloor: 25, bedsPerRoom: 3 },
  { name: 'C', type: 'non-attached', feePerYear: 65000, floors: 4, roomsPerFloor: 25, bedsPerRoom: 3 },
  { name: 'D', type: 'non-attached', feePerYear: 65000, floors: 4, roomsPerFloor: 25, bedsPerRoom: 3 },
];

async function seed() {
  await connectDB();
  console.log('Seeding database...');

  // Clear existing data
  await Promise.all([Hostel.deleteMany(), Room.deleteMany(), Manager.deleteMany()]);

  for (const hostelData of HOSTELS) {
    const hostel = await Hostel.create({
      name: hostelData.name,
      type: hostelData.type,
      feePerYear: hostelData.feePerYear,
      floors: hostelData.floors,
      roomsPerFloor: hostelData.roomsPerFloor,
      bedsPerRoom: hostelData.bedsPerRoom,
      totalRooms: hostelData.floors * hostelData.roomsPerFloor,
    });

    const beds = ['A', 'B', 'C'].slice(0, hostelData.bedsPerRoom);
    const roomDocs = [];
    for (let floor = 1; floor <= hostelData.floors; floor++) {
      for (let roomNum = 1; roomNum <= hostelData.roomsPerFloor; roomNum++) {
        roomDocs.push({
          hostel: hostel._id,
          floor,
          roomNumber: roomNum,
          type: hostelData.type,
          totalBeds: beds.length,
          beds: beds.map((label) => ({ bedLabel: label, isBooked: false, student: null })),
          isUnlocked: floor === 1 && roomNum === 1,
        });
      }
    }
    await Room.insertMany(roomDocs);
    console.log(`Hostel ${hostelData.name}: ${roomDocs.length} rooms created`);
  }

  // Create admin account
  const adminHostel = await Hostel.findOne();
  const adminExists = await Manager.findOne({ isAdmin: true });
  if (!adminExists) {
    await Manager.create({
      username: 'admin',
      firstName: 'System',
      lastName: 'Admin',
      mobileNo: '9999999999',
      email: 'admin@hostel.com',
      password: 'admin123',
      hostel: adminHostel._id,
      isAdmin: true,
    });
    console.log('Admin created: username=admin, password=admin123');
  }

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
