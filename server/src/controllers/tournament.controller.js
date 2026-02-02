import prisma from "../prisma.js";

export const getAllTournaments = async (req, res) => {
  const tournaments = await prisma.tournament.findMany({
    include: {
      registrations: {
        where: { status: "APPROVED" }
      }
    }
  });

  const formatted = tournaments.map(t => ({
    ...t,
    remainingSlots: t.maxSlots - t.registrations.length
  }));

  res.json(formatted);
};

export const getTournamentById = async (req, res) => {
  const { id } = req.params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      registrations: {
        where: { status: "APPROVED" }
      }
    }
  });

  if (!tournament)
    return res.status(404).json({ message: "Tournament not found" });

  res.json({
    ...tournament,
    remainingSlots: tournament.maxSlots - tournament.registrations.length
  });
};

export const createTournament = async (req, res) => {
  const {
    title,
    game,
    format,
    entryFee,
    prizePool,
    maxSlots,
    startDateTime,
    rules,
    upiId
  } = req.body;

  const tournament = await prisma.tournament.create({
    data: {
      title,
      game,
      format,
      entryFee,
      prizePool,
      maxSlots,
      startDateTime: new Date(startDateTime),
      rules,
      upiId
    }
  });

  res.json(tournament);
};





export const activeTournament = async (req, res) => {
  try {
    const now = new Date();

    const tournaments = await prisma.tournament.findMany({
      where: {
        startDateTime: {
          gt: now // upcoming tournaments only
        }
      },
      include: {
        registrations: {
          where: {
            OR: [
              { status: "APPROVED" },
              {
                status: "PENDING",
                reservedUntil: { gt: now }
              }
            ]
          }
        }
      },
      orderBy: {
        startDateTime: "asc"
      }
    });

    // calculate remaining slots
    const formatted = tournaments.map(t => ({
      id: t.id,
      title: t.title,
      game: t.game,
      format: t.format,
      entryFee: t.entryFee,
      prizePool: t.prizePool,
      maxSlots: t.maxSlots,
      startDateTime: t.startDateTime,
      remainingSlots: t.maxSlots - t.registrations.length
    }));

    res.status(200).json(formatted);

  } catch (err) {
    console.error("Active Tournament Error:", err);
    res.status(500).json({ message: "Failed to fetch active tournaments" });
  }
};
