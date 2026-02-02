import prisma from "../prisma.js";

const RESERVE_MINUTES = 15;

export const registerForTournament = async (req, res) => {
  const { tournamentId, teamName, teamMembers } = req.body;
  const userId = req.user.id;

  // 1. user must have verified email
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user.emailVerified) {
    return res.status(403).json({ message: "Verify email first" });
  }

  // 2. prevent duplicate registration
  const existing = await prisma.registration.findUnique({
    where: {
      userId_tournamentId: {
        userId,
        tournamentId
      }
    }
  });

  if (existing) {
    return res.status(400).json({ message: "Already registered" });
  }

  // 3. check available slots
  const tournament = await prisma.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      registrations: {
        where: {
          OR: [
            { status: "APPROVED" },
            {
              status: "PENDING",
              reservedUntil: { gt: new Date() }
            }
          ]
        }
      }
    }
  });

  if (!tournament) {
    return res.status(404).json({ message: "Tournament not found" });
  }

  if (tournament.registrations.length >= tournament.maxSlots) {
    return res.status(400).json({ message: "Slots full" });
  }

  // 4. reserve slot
  const reservedUntil = new Date(
    Date.now() + RESERVE_MINUTES * 60 * 1000
  );

  const registration = await prisma.registration.create({
    data: {
      userId,
      tournamentId,
      teamName,
      reservedUntil,
      teamMembers: {
        create: teamMembers
      }
    }
  });

  res.json({
    message: "Registered successfully. Await admin approval.",
    registration
  });
};

export const myRegistrations = async (req, res) => {
  const regs = await prisma.registration.findMany({
    where: { userId: req.user.id },
    include: {
      tournament: true,
      teamMembers: true
    }
  });

  res.json(regs);
};
