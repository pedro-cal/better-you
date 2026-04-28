import { db } from './index';
import { pathTemplates } from './schema';
import type { LifeDomain } from '@better-you/shared';

type TemplateInput = typeof pathTemplates.$inferInsert;

const templates: TemplateInput[] = [
  {
    domain: 'BODY' as LifeDomain,
    title: '30-Minute Daily Movement',
    description: 'Build a sustainable daily exercise habit with short, varied workouts.',
    minutesPerWeekEstimate: 210,
    difficulty: 'beginner',
    tags: ['fitness', 'health', 'daily'],
    stepsJson: [
      { title: '10-min morning stretch', cadence: 'daily', estimatedMinutes: 10 },
      { title: '20-min cardio or strength', cadence: 'daily', estimatedMinutes: 20 },
    ],
  },
  {
    domain: 'MIND' as LifeDomain,
    title: 'Daily Mindfulness Practice',
    description: 'Reduce stress and improve focus with a short daily meditation routine.',
    minutesPerWeekEstimate: 70,
    difficulty: 'beginner',
    tags: ['mindfulness', 'mental-health', 'daily'],
    stepsJson: [
      { title: '10-min guided meditation', cadence: 'daily', estimatedMinutes: 10 },
    ],
  },
  {
    domain: 'SOCIAL' as LifeDomain,
    title: 'Deepen One Relationship Per Week',
    description: 'Intentionally invest in meaningful connections by reaching out regularly.',
    minutesPerWeekEstimate: 60,
    difficulty: 'beginner',
    tags: ['relationships', 'social', 'weekly'],
    stepsJson: [
      { title: 'Reach out to one person', cadence: 'weekly', estimatedMinutes: 30 },
      { title: 'Plan a shared activity', cadence: 'weekly', estimatedMinutes: 30 },
    ],
  },
  {
    domain: 'WORK' as LifeDomain,
    title: 'Deep Work Blocks',
    description: 'Protect focused work time each day to make progress on meaningful projects.',
    minutesPerWeekEstimate: 300,
    difficulty: 'intermediate',
    tags: ['productivity', 'focus', 'daily'],
    stepsJson: [
      { title: '60-min deep work session', cadence: 'daily', estimatedMinutes: 60 },
    ],
  },
  {
    domain: 'MONEY' as LifeDomain,
    title: 'Weekly Financial Review',
    description: 'Stay on top of spending and savings with a short weekly check-in.',
    minutesPerWeekEstimate: 30,
    difficulty: 'beginner',
    tags: ['finance', 'budgeting', 'weekly'],
    stepsJson: [
      { title: 'Review transactions', cadence: 'weekly', estimatedMinutes: 15 },
      { title: 'Update savings tracker', cadence: 'weekly', estimatedMinutes: 15 },
    ],
  },
  {
    domain: 'SERVICE' as LifeDomain,
    title: 'Volunteer or Give Back Monthly',
    description: 'Contribute to your community through a recurring act of service.',
    minutesPerWeekEstimate: 60,
    difficulty: 'beginner',
    tags: ['community', 'volunteering', 'monthly'],
    stepsJson: [
      { title: 'Identify opportunity to help', cadence: 'monthly', estimatedMinutes: 15 },
      { title: 'Complete service activity', cadence: 'monthly', estimatedMinutes: 120 },
    ],
  },
  {
    domain: 'SPIRITUALITY' as LifeDomain,
    title: 'Morning Reflection Practice',
    description: 'Start each day with intention through journaling or prayer.',
    minutesPerWeekEstimate: 70,
    difficulty: 'beginner',
    tags: ['spirituality', 'journaling', 'daily'],
    stepsJson: [
      { title: 'Write 3 gratitudes', cadence: 'daily', estimatedMinutes: 5 },
      { title: '5-min reflection or prayer', cadence: 'daily', estimatedMinutes: 5 },
    ],
  },
];

async function seed() {
  console.log('Seeding path_templates…');
  await db.insert(pathTemplates).values(templates).onConflictDoNothing();
  console.log(`Inserted ${templates.length} templates.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
