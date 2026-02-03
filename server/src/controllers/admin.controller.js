import prisma from "../prisma.js";
import { getNextSpot } from "../utils/slotLogic.js";
import sendEmail from "../utils/email.js";

export const approve = async (req, res) => {
  const regs = await prisma.registration.findMany({
    where: { tournamentId: req.body.tournamentId, status: "APPROVED" }
  });

  const spot = getNextSpot(regs);

  const updated = await prisma.registration.update({
    where: { id: req.body.registrationId },
    data: { status: "APPROVED", spotNumber: spot }
  });

  res.json(updated);
};

export const reject = async (req, res) => {
  const reg = await prisma.registration.update({
    where: { id: req.body.registrationId },
    data: { status: "REJECTED", spotNumber: null }
  });
  res.json(reg);
};

export const create = async (req, res) => {
  try {
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

    
    if (
      !title ||
      !game ||
      !format ||
      !entryFee ||
      !prizePool ||
      !maxSlots ||
      !startDateTime ||
      !upiId
    ) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    // 🏆 Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        title,
        game,
        format,
        entryFee: Number(entryFee),
        prizePool,
        maxSlots: Number(maxSlots),
        startDateTime: new Date(startDateTime),
        rules,
        upiId
      }
    });

    res.status(201).json({
      message: "Tournament created successfully",
      tournament
    });

  } catch (err) {
    console.error("Create Tournament Error:", err);
    res.status(500).json({
      message: "Failed to create tournament"
    });
  }
};

export const pendingRegistrations = async (req, res) => {
  const pending = await prisma.registration.findMany({
    where: { status: "PENDING" },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      tournament: {
        select: {
          id: true,
          title: true,
          format: true
        }
      },
      teamMembers: true
    },
    orderBy: { createdAt: "asc" }
  });

  res.json(pending);
};

export const registrationsByStatus = async (req, res) => {
  const status = String(req.query.status || "").toUpperCase();
  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const regs = await prisma.registration.findMany({
    where: { status },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      tournament: {
        select: {
          id: true,
          title: true,
          format: true
        }
      },
      teamMembers: true
    },
    orderBy: { createdAt: "desc" }
  });

  res.json(regs);
};

export const broadcastTournamentEmail = async (req, res) => {
  const { tournamentId, subject, message, status } = req.body;

  if (!tournamentId || !subject || !message) {
    return res.status(400).json({ message: "tournamentId, subject, message are required" });
  }

  const normalizedStatus = status
    ? String(status).toUpperCase()
    : "APPROVED";

  const statusFilter = normalizedStatus === "ALL"
    ? { in: ["PENDING", "APPROVED"] }
    : normalizedStatus;

  if (
    normalizedStatus !== "ALL" &&
    !["PENDING", "APPROVED"].includes(normalizedStatus)
  ) {
    return res.status(400).json({ message: "Invalid status filter" });
  }

  const regs = await prisma.registration.findMany({
    where: {
      tournamentId,
      status: statusFilter
    },
    include: {
      user: {
        select: {
          email: true,
          name: true
        }
      },
      tournament: {
        select: {
          title: true
        }
      }
    }
  });

  const emails = Array.from(
    new Set(regs.map((r) => r.user?.email).filter(Boolean))
  );

  if (!emails.length) {
    return res.status(404).json({ message: "No recipients found" });
  }

  const safeMessage = String(message).replace(/\n/g, "<br/>");
  const tournamentTitle = regs[0]?.tournament?.title || "Tournament";

  await Promise.all(
    emails.map((to) =>
      sendEmail({
        to,
        subject,
        html: `
          <p>Hello Team Leader,</p>
          <p><strong>${tournamentTitle}</strong></p>
          <p>${safeMessage}</p>
          <p>— Esports Admin</p>
        `
      })
    )
  );

  res.json({ sent: emails.length });
};
