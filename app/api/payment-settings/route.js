import { NextResponse } from 'next/server';
import db from '@/lib/db';
import PaymentSettings from '@/models/paymentSettingsModel';
import handleAsyncError from '@/middleware/handleAsyncError';

export const POST = handleAsyncError(async (request) => {
  await db();
  const body = await request.json();
  const { taxPercentage, shippingZones, freeShippingThreshold, activeDivisions, activeDistricts, bkashNumber, bkashInstructions, rocketNumber, rocketInstructions, nagadNumber, nagadInstructions, securityDepositPercentage } = body;

  let settings = await PaymentSettings.findOne();

  if (settings) {
    // Update existing settings
    settings.taxPercentage = taxPercentage;
    settings.shippingZones = shippingZones;
    settings.freeShippingThreshold = freeShippingThreshold;
    settings.activeDivisions = activeDivisions;
    settings.activeDistricts = activeDistricts;
    settings.bkashNumber = bkashNumber;
    settings.bkashInstructions = bkashInstructions;
    settings.rocketNumber = rocketNumber;
    settings.rocketInstructions = rocketInstructions;
    settings.nagadNumber = nagadNumber;
    settings.nagadInstructions = nagadInstructions;
    settings.securityDepositPercentage = securityDepositPercentage;
    await settings.save();
  } else {
    // Create new settings
    settings = await PaymentSettings.create({
      taxPercentage,
      shippingZones,
      freeShippingThreshold,
      activeDivisions,
      activeDistricts,
      bkashNumber,
      bkashInstructions,
      rocketNumber,
      rocketInstructions,
      nagadNumber,
      nagadInstructions,
      securityDepositPercentage,
    });
  }



  return NextResponse.json({ success: true, settings }, { status: 200 });
});

export const GET = handleAsyncError(async () => {
  await db();
  const settings = await PaymentSettings.findOne();

  return NextResponse.json(settings || {});
});
