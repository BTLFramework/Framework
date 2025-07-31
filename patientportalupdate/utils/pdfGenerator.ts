import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// Back to Life brand colors
const BTL_COLORS = {
  primary: '#155e75',
  secondary: '#0891b2',
  accent: '#06b6d4',
  light: '#e0f2fe',
  dark: '#0c4a6e',
  gradient: ['#155e75', '#0891b2', '#06b6d4', '#22d3ee']
}

// Helper function to create gradient background
const createGradientBackground = (doc: jsPDF, x: number, y: number, width: number, height: number) => {
  const steps = 20
  const stepHeight = height / steps
  
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1)
    const colorIndex = Math.floor(progress * (BTL_COLORS.gradient.length - 1))
    const nextColorIndex = Math.min(colorIndex + 1, BTL_COLORS.gradient.length - 1)
    const localProgress = (progress * (BTL_COLORS.gradient.length - 1)) % 1
    
    const color1 = BTL_COLORS.gradient[colorIndex]
    const color2 = BTL_COLORS.gradient[nextColorIndex]
    
    // Simple color interpolation
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)
    
    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)
    
    const r = Math.round(r1 + (r2 - r1) * localProgress)
    const g = Math.round(g1 + (g2 - g1) * localProgress)
    const b = Math.round(b1 + (b2 - b1) * localProgress)
    
    doc.setFillColor(r, g, b)
    doc.rect(x, y + i * stepHeight, width, stepHeight, 'F')
  }
}

// Helper function to create rounded rectangle
const createRoundedRect = (doc: jsPDF, x: number, y: number, width: number, height: number, radius: number, fill: boolean = false) => {
  doc.setDrawColor(21, 94, 117)
  doc.setFillColor(240, 249, 255)
  doc.roundedRect(x, y, width, height, radius, radius, fill ? 'F' : 'S')
}

// Helper function to create section header
const createSectionHeader = (doc: jsPDF, x: number, y: number, text: string, icon: string) => {
  // Background rectangle
  doc.setFillColor(21, 94, 117)
  doc.rect(x, y, 200, 12, 'F')
  
  // Text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`${icon} ${text}`, x + 5, y + 8)
}

// Create a beautiful Pain Journal PDF
export const generatePainJournalPDF = async () => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  let yPosition = margin

  // Create beautiful gradient header
  createGradientBackground(doc, 0, 0, pageWidth, 50)
  
  // Logo placeholder (we'll add a proper logo later)
  doc.setFillColor(255, 255, 255)
  doc.circle(30, 25, 8, 'F')
  doc.setTextColor(21, 94, 117)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('B', 30, 29, { align: 'center' })
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('Back to Life', pageWidth / 2, 25, { align: 'center' })
  
  doc.setFontSize(16)
  doc.text('Pain Tracking Journal', pageWidth / 2, 35, { align: 'center' })
  
  // Subtitle
  doc.setFontSize(10)
  doc.text('Evidence-Based Daily Assessment', pageWidth / 2, 42, { align: 'center' })

  yPosition = 60

  // Date section with styled box
  createRoundedRect(doc, margin, yPosition - 5, contentWidth, 20, 5, true)
  doc.setTextColor(21, 94, 117)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('📅 Daily Assessment', margin + 10, yPosition + 5)
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${new Date().toLocaleDateString()}`, margin + 10, yPosition + 15)
  yPosition += 30

  // Pain Level Section
  createSectionHeader(doc, margin, yPosition, 'Pain Assessment', '🔍')
  yPosition += 20

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Pain Level (0-10): _____', margin + 5, yPosition)
  yPosition += 10

  // Visual pain scale with gradient
  const scaleWidth = 160
  const scaleHeight = 8
  const scaleX = margin + 5
  const scaleY = yPosition
  
  // Create gradient pain scale
  for (let i = 0; i < 10; i++) {
    const x = scaleX + (i * (scaleWidth / 10))
    const width = scaleWidth / 10
    
    // Color gradient from green to red
    const intensity = i / 9
    const r = Math.round(255 * intensity)
    const g = Math.round(255 * (1 - intensity))
    const b = 0
    
    doc.setFillColor(r, g, b)
    doc.rect(x, scaleY, width, scaleHeight, 'F')
    doc.setDrawColor(0, 0, 0)
    doc.rect(x, scaleY, width, scaleHeight, 'S')
    
    // Number labels
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text((i + 1).toString(), x + width/2, scaleY + 6, { align: 'center' })
  }
  
  // Scale labels
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text('No Pain', scaleX, scaleY + 15)
  doc.text('Severe Pain', scaleX + scaleWidth - 25, scaleY + 15)
  yPosition += 25

  // Location of Pain
  createSectionHeader(doc, margin, yPosition, 'Location of Pain', '📍')
  yPosition += 20

  const locations = ['Neck', 'Upper Back', 'Lower Back', 'Shoulders', 'Arms', 'Legs']
  const locationsPerRow = 3
  for (let i = 0; i < locations.length; i += locationsPerRow) {
    const row = locations.slice(i, i + locationsPerRow)
    let xPos = margin + 5
    row.forEach((location, index) => {
      // Create checkbox
      doc.setDrawColor(21, 94, 117)
      doc.rect(xPos, yPosition - 3, 4, 4, 'S')
      doc.text(`☐ ${location}`, xPos + 8, yPosition)
      xPos += 60
    })
    yPosition += 8
  }
  yPosition += 10

  // Pain Quality
  createSectionHeader(doc, margin, yPosition, 'Pain Quality', '💭')
  yPosition += 20

  const qualities = ['Aching', 'Sharp', 'Burning', 'Tingling', 'Numbness', 'Stiffness']
  for (let i = 0; i < qualities.length; i += locationsPerRow) {
    const row = qualities.slice(i, i + locationsPerRow)
    let xPos = margin + 5
    row.forEach((quality, index) => {
      doc.setDrawColor(21, 94, 117)
      doc.rect(xPos, yPosition - 3, 4, 4, 'S')
      doc.text(`☐ ${quality}`, xPos + 8, yPosition)
      xPos += 60
    })
    yPosition += 8
  }
  yPosition += 10

  // Pain Triggers
  createSectionHeader(doc, margin, yPosition, 'Pain Triggers', '⚡')
  yPosition += 20

  const triggers = ['Sitting too long', 'Standing too long', 'Lifting', 'Bending', 'Stress', 'Weather changes', 'Poor sleep']
  for (let i = 0; i < triggers.length; i += 2) {
    const row = triggers.slice(i, i + 2)
    let xPos = margin + 5
    row.forEach((trigger, index) => {
      doc.setDrawColor(21, 94, 117)
      doc.rect(xPos, yPosition - 3, 4, 4, 'S')
      doc.text(`☐ ${trigger}`, xPos + 8, yPosition)
      xPos += 90
    })
    yPosition += 8
  }
  yPosition += 15

  // Activities Section
  createSectionHeader(doc, margin, yPosition, 'Activities Completed Today', '✅')
  yPosition += 20

  const activities = ['Movement session', 'Walking', 'Stretching', 'Work activities', 'Household tasks']
  activities.forEach(activity => {
    doc.setDrawColor(21, 94, 117)
    doc.rect(margin + 5, yPosition - 3, 4, 4, 'S')
    doc.text(`☐ ${activity}`, margin + 13, yPosition)
    yPosition += 8
  })
  yPosition += 10

  // Sleep & Stress Section
  createSectionHeader(doc, margin, yPosition, 'Sleep & Stress Assessment', '🌙')
  yPosition += 20

  doc.text('Sleep Quality (1-10): _____', margin + 5, yPosition)
  yPosition += 8
  doc.text('Hours of Sleep: _____', margin + 5, yPosition)
  yPosition += 8
  doc.text('Stress Level (1-10): _____', margin + 5, yPosition)
  yPosition += 15

  // Notes Section
  createSectionHeader(doc, margin, yPosition, 'Notes & Observations', '📝')
  yPosition += 20

  for (let i = 0; i < 3; i++) {
    doc.setDrawColor(21, 94, 117)
    doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition)
    yPosition += 10
  }
  yPosition += 10

  // Recovery Goals Section
  createSectionHeader(doc, margin, yPosition, 'Recovery Goals Progress', '🎯')
  yPosition += 20

  const goals = ['Completed movement session', 'Practiced breathing exercises', 'Used proper posture', 'Took breaks as needed']
  goals.forEach(goal => {
    doc.setDrawColor(21, 94, 117)
    doc.rect(margin + 5, yPosition - 3, 4, 4, 'S')
    doc.text(`☐ ${goal}`, margin + 13, yPosition)
    yPosition += 8
  })
  yPosition += 10

  // Tomorrow's Focus
  createSectionHeader(doc, margin, yPosition, 'Tomorrow\'s Focus', '🚀')
  yPosition += 20

  for (let i = 0; i < 2; i++) {
    doc.setDrawColor(21, 94, 117)
    doc.line(margin + 5, yPosition, pageWidth - margin - 5, yPosition)
    yPosition += 10
  }

  // Footer with gradient
  createGradientBackground(doc, 0, pageHeight - 40, pageWidth, 40)
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Evidence-Based Principles: Pain Neuroscience Education • Biopsychosocial Model • Activity Pacing • Sleep-Pain Correlation', pageWidth / 2, pageHeight - 25, { align: 'center' })
  doc.text('Back to Life - Your Recovery Journey', pageWidth / 2, pageHeight - 15, { align: 'center' })

  // Save the PDF
  doc.save(`Back-to-Life-Pain-Journal-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Create a beautiful SMART Goals PDF
export const generateSMARTGoalsPDF = async () => {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  let yPosition = margin

  // Create beautiful gradient header
  createGradientBackground(doc, 0, 0, pageWidth, 50)
  
  // Logo placeholder
  doc.setFillColor(255, 255, 255)
  doc.circle(30, 25, 8, 'F')
  doc.setTextColor(21, 94, 117)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('B', 30, 29, { align: 'center' })
  
  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('Back to Life', pageWidth / 2, 25, { align: 'center' })
  
  doc.setFontSize(16)
  doc.text('SMART Recovery Goals', pageWidth / 2, 35, { align: 'center' })
  
  // Subtitle
  doc.setFontSize(10)
  doc.text('Evidence-Based Goal Setting Framework', pageWidth / 2, 42, { align: 'center' })

  yPosition = 60

  // SMART Framework with styled box
  createRoundedRect(doc, margin, yPosition - 5, contentWidth, 50, 5, true)
  doc.setTextColor(21, 94, 117)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('🎯 SMART Goal Setting Framework', margin + 10, yPosition + 5)
  yPosition += 15

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const smartFramework = [
    'S - SPECIFIC: Clear, detailed goal with concrete actions',
    'M - MEASURABLE: Can track progress with numbers or observations',
    'A - ACHIEVABLE: Realistic for your current situation and abilities',
    'R - RELEVANT: Important to your recovery journey and long-term health',
    'T - TIME-BOUND: Has a specific deadline or timeframe'
  ]
  
  smartFramework.forEach(item => {
    doc.text(item, margin + 10, yPosition)
    yPosition += 8
  })
  yPosition += 15

  // Movement & Function Goals
  createSectionHeader(doc, margin, yPosition, 'Movement & Function Goals', '🏃‍♂️')
  yPosition += 20

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  
  const movementGoals = [
    'Week 1-2 (Foundation): Walk 10 min daily, Movement session 3x/week',
    'Week 2-4 (Confidence): Stand 15 min without pain, Walk 15 min daily',
    'Week 3-6 (Functional): Light household tasks, Stand 20 min without pain',
    'Week 4-8 (Strength): Movement session 4x/week, Stand 30 min without pain',
    'Week 6-12 (Full Function): Return to work, 30+ min activity daily'
  ]
  
  movementGoals.forEach(goal => {
    doc.setDrawColor(21, 94, 117)
    doc.rect(margin + 5, yPosition - 3, 4, 4, 'S')
    doc.text(`☐ ${goal}`, margin + 13, yPosition)
    yPosition += 10
  })
  yPosition += 10

  // Pain Management Goals
  createSectionHeader(doc, margin, yPosition, 'Pain Management Goals', '💆‍♀️')
  yPosition += 20

  const painGoals = [
    'Week 1-2 (Awareness): Breathing exercises 2x/day, Learn PNE concepts',
    'Week 1-4 (Skills): Reduce catastrophizing, Stress management techniques',
    'Week 2-6 (Integration): Mindfulness 10 min daily, Pain levels <6/10',
    'Week 4-8 (Mastery): Pain self-management skills, Mindfulness 15 min daily',
    'Week 6-12 (Independence): Master techniques, Support others'
  ]
  
  painGoals.forEach(goal => {
    doc.setDrawColor(21, 94, 117)
    doc.rect(margin + 5, yPosition - 3, 4, 4, 'S')
    doc.text(`☐ ${goal}`, margin + 13, yPosition)
    yPosition += 10
  })
  yPosition += 10

  // Sleep & Recovery Goals
  createSectionHeader(doc, margin, yPosition, 'Sleep & Recovery Goals', '🌙')
  yPosition += 20

  const sleepGoals = [
    'Week 1-2 (Foundation): Consistent sleep schedule, Bedtime routine',
    'Week 1-4 (Hygiene): Sleep hygiene techniques, Reduce screen time',
    'Week 2-6 (Quality): 7-8 hours quality sleep, Track sleep-pain correlation',
    'Week 4-8 (Optimization): 8+ hours quality sleep, Optimize environment',
    'Week 6-12 (Mastery): Master sleep hygiene, Support others'
  ]
  
  sleepGoals.forEach(goal => {
    doc.setDrawColor(21, 94, 117)
    doc.rect(margin + 5, yPosition - 3, 4, 4, 'S')
    doc.text(`☐ ${goal}`, margin + 13, yPosition)
    yPosition += 10
  })
  yPosition += 15

  // Goal Tracking Template
  createSectionHeader(doc, margin, yPosition, 'Goal Tracking Template', '📋')
  yPosition += 20

  doc.text('My SMART Goal: _________________________________________________________', margin + 5, yPosition)
  yPosition += 10
  doc.text('Specific: ________________________________________________________________', margin + 5, yPosition)
  yPosition += 8
  doc.text('Measurable: ______________________________________________________________', margin + 5, yPosition)
  yPosition += 8
  doc.text('Achievable: ______________________________________________________________', margin + 5, yPosition)
  yPosition += 8
  doc.text('Relevant: ________________________________________________________________', margin + 5, yPosition)
  yPosition += 8
  doc.text('Time-bound: ______________________________________________________________', margin + 5, yPosition)
  yPosition += 15

  // Progress Tracking
  doc.text('📊 Progress Tracking:', margin + 5, yPosition)
  yPosition += 10
  
  for (let week = 1; week <= 4; week++) {
    let xPos = margin + 5
    doc.text(`Week ${week}:`, xPos, yPosition)
    xPos += 30
    for (let day = 1; day <= 7; day++) {
      doc.setDrawColor(21, 94, 117)
      doc.rect(xPos, yPosition - 3, 4, 4, 'S')
      xPos += 8
    }
    yPosition += 10
  }

  // Footer with gradient
  createGradientBackground(doc, 0, pageHeight - 40, pageWidth, 40)
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Evidence-Based Principles: Graded Exposure • Activity Pacing • Pain Neuroscience Education • CBT • Sleep Hygiene', pageWidth / 2, pageHeight - 25, { align: 'center' })
  doc.text('Back to Life - Your Recovery Journey', pageWidth / 2, pageHeight - 15, { align: 'center' })

  // Save the PDF
  doc.save(`Back-to-Life-SMART-Goals-${new Date().toISOString().split('T')[0]}.pdf`)
} 