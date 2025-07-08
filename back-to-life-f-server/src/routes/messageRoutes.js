const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Send message from clinician to patient
router.post('/send', async (req, res) => {
  try {
    const { patientId, subject, content, senderName, senderEmail } = req.body;

    if (!patientId || !subject || !content || !senderName) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, subject, content, senderName'
      });
    }

    // Verify patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        patientId: parseInt(patientId),
        subject,
        content,
        senderType: 'CLINICIAN',
        senderName,
        senderEmail: senderEmail || null
      }
    });

    console.log(`📧 Message sent from ${senderName} to ${patient.name}: ${subject}`);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message.id,
        subject: message.subject,
        sentTo: patient.name,
        sentAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get all conversations for clinician portal
router.get('/conversations', async (req, res) => {
  try {
    // Get all patients who have messages
    const patients = await prisma.patient.findMany({
      where: {
        messages: {
          some: {}
        }
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1 // Get only the latest message for preview
        }
      }
    });

    // Format for clinician portal
    const conversations = await Promise.all(
      patients.map(async (patient) => {
        // Get unread count (messages from patient to clinician that are unread)
        const unreadCount = await prisma.message.count({
          where: {
            patientId: patient.id,
            senderType: 'PATIENT',
            isRead: false
          }
        });

        // Get total message count
        const totalMessages = await prisma.message.count({
          where: { patientId: patient.id }
        });

        const lastMessage = patient.messages[0];

        return {
          patientId: patient.id,
          patientName: patient.name,
          patientEmail: patient.email,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            subject: lastMessage.subject,
            timestamp: lastMessage.createdAt,
            senderType: lastMessage.senderType,
            senderName: lastMessage.senderName
          } : null,
          unreadCount,
          totalMessages,
          intakeDate: patient.intakeDate
        };
      })
    );

    // Sort by most recent activity (unread messages first, then by latest message)
    conversations.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      
      if (a.lastMessage && b.lastMessage) {
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
      }
      
      return 0;
    });

    res.json({
      success: true,
      conversations,
      total: conversations.length
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      error: 'Failed to fetch conversations',
      details: error.message
    });
  }
});

// Get messages for a specific conversation (clinician view)
router.get('/conversation/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    // Get patient info
    const patient = await prisma.patient.findUnique({
      where: { id: parseInt(patientId) },
      select: { id: true, name: true, email: true, intakeDate: true }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Get messages for this conversation
    const messages = await prisma.message.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Mark patient messages as read when clinician views them
    await prisma.message.updateMany({
      where: {
        patientId: parseInt(patientId),
        senderType: 'PATIENT',
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({
      success: true,
      patient,
      messages,
      total: messages.length
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      error: 'Failed to fetch conversation',
      details: error.message
    });
  }
});

// Get messages for a patient (for patient portal)
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.message.findMany({
      where: { patientId: parseInt(patientId) },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Format messages for patient portal
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      subject: msg.subject,
      content: msg.content,
      senderName: msg.senderName,
      senderType: msg.senderType,
      isRead: msg.isRead,
      timestamp: msg.createdAt,
      isOwn: msg.senderType === 'PATIENT'
    }));

    res.json({
      success: true,
      messages: formattedMessages,
      total: messages.length
    });

  } catch (error) {
    console.error('Error fetching patient messages:', error);
    res.status(500).json({
      error: 'Failed to fetch messages',
      details: error.message
    });
  }
});

// Mark all messages as read for a patient (when they view messages page)
router.patch('/patient/:patientId/mark-read', async (req, res) => {
  try {
    const { patientId } = req.params;

    // Mark all unread messages from clinicians as read
    const result = await prisma.message.updateMany({
      where: { 
        patientId: parseInt(patientId),
        senderType: 'CLINICIAN',
        isRead: false 
      },
      data: { isRead: true }
    });

    console.log(`📖 Marked ${result.count} messages as read for patient ${patientId}`);

    res.json({
      success: true,
      message: `Marked ${result.count} messages as read`,
      markedAsRead: result.count
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      error: 'Failed to mark messages as read',
      details: error.message
    });
  }
});

// Send message from patient to clinician
router.post('/reply', async (req, res) => {
  try {
    const { patientId, subject, content, senderName } = req.body;

    if (!patientId || !content || !senderName) {
      return res.status(400).json({
        error: 'Missing required fields: patientId, content, senderName'
      });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        patientId: parseInt(patientId),
        subject: subject || 'Reply from patient',
        content,
        senderType: 'PATIENT',
        senderName
      }
    });

    console.log(`📧 Reply sent from patient ${senderName}: ${subject}`);

    res.status(201).json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        id: message.id,
        subject: message.subject,
        sentAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Error sending reply:', error);
    res.status(500).json({
      error: 'Failed to send reply',
      details: error.message
    });
  }
});

module.exports = router; 