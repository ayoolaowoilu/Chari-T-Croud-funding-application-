import { NextRequest, NextResponse } from 'next/server';

type StorySection = {
  topic: string;
  details: string;
};

type BlogCard = {
  topic: string;
  description: string;
  likes: number;
  comments: number;
  min_read: number;
  content: StorySection[];
  img_url: string;
};

const BLOG_DATA: BlogCard[] = [
 
  {
    topic: 'New Years Eve with Chari-T',
    description:
      'Join us for a spectacular evening of giving and celebration as we ring in the new year together with our amazing community of donors and volunteers.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Event Highlights',
        details:
          'The evening featured live performances from local artists, a silent auction with over 50 items, and heartfelt stories from beneficiaries who have been impacted by your generosity over the past year.',
      },
      {
        topic: 'Fundraising Results',
        details:
          'Thanks to your incredible support, we raised over $150,000 during the event — exceeding our goal by 30%. These funds will directly support education programs in underserved communities.',
      },
      {
        topic: 'Looking Ahead',
        details:
          "As we step into the new year, we're excited to announce three new partnership programs that will expand our reach to 5,000 additional families across the region.",
      },
    ],
    img_url: 'https://picsum.photos/seed/charity-nye/1584/396',
  },
  // ─── 2. Community Drive Success ───────────────────────────────────
  {
    topic: 'Community Drive Success',
    description:
      'Our latest community drive brought together hundreds of volunteers to make a real difference in local neighborhoods.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Volunteer Stories',
        details:
          'Over 200 volunteers dedicated their weekend to sorting donations, preparing meals, and distributing essential supplies to families in need.',
      },
      {
        topic: 'Impact Metrics',
        details:
          'We distributed 5,000+ meals, 1,200 hygiene kits, and 800 winter clothing packages to families across 12 different neighborhoods.',
      },
    ],
    img_url: 'https://picsum.photos/seed/community-drive/1584/396',
  },
  // ─── 3. Technology for Good Initiative ────────────────────────────
  {
    topic: 'Technology for Good Initiative',
    description:
      'Exploring how modern technology can bridge gaps and create opportunities for charitable organizations worldwide.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Digital Transformation',
        details:
          'Nonprofits are increasingly adopting cloud-based solutions to streamline operations, reduce overhead costs, and improve donor engagement through data-driven insights.',
      },
      {
        topic: 'AI in Philanthropy',
        details:
          'Machine learning algorithms now help identify the most effective intervention strategies by analyzing historical outcome data and predicting community needs.',
      },
      {
        topic: 'Blockchain Transparency',
        details:
          'Smart contracts and distributed ledgers are revolutionizing how donors track their contributions, ensuring every dollar reaches its intended destination with full accountability.',
      },
    ],
    img_url: 'https://picsum.photos/seed/tech-good/1584/396',
  },
  // ─── 4. Clean Water Project Launch ────────────────────────────────
  {
    topic: 'Clean Water Project Launch',
    description:
      'Chari-T is proud to announce our new initiative to bring clean, safe drinking water to rural communities in need.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Project Overview',
        details:
          'In partnership with local engineers and health organizations, we are building 12 new water wells and filtration systems across three underserved regions.',
      },
      {
        topic: 'Community Involvement',
        details:
          'Local residents are actively participating in the construction and maintenance training, ensuring long-term sustainability and community ownership of the project.',
      },
      {
        topic: 'Expected Impact',
        details:
          'This project will provide clean water access to over 3,500 people, significantly reducing waterborne illness rates and improving overall quality of life.',
      },
    ],
    img_url: 'https://picsum.photos/seed/clean-water/1584/396',
  },
  // ─── 5. Back-to-School Supply Drive ───────────────────────────────
  {
    topic: 'Back-to-School Supply Drive',
    description:
      'Help us equip every child with the tools they need to succeed this school year. Our annual supply drive is now live.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'What We Need',
        details:
          'We are collecting backpacks, notebooks, pencils, calculators, and art supplies to distribute to students from low-income families before the new term begins.',
      },
      {
        topic: 'How to Donate',
        details:
          'Drop off supplies at any of our 8 local collection centers, or contribute online and we will purchase items on your behalf at wholesale prices.',
      },
      {
        topic: "Last Year's Success",
        details:
          'Thanks to donors like you, we provided fully stocked backpacks to over 1,200 students last year, and we aim to reach 1,500 this year.',
      },
    ],
    img_url: 'https://picsum.photos/seed/back-to-school/1584/396',
  },
  // ─── 6. Winter Shelter Program ────────────────────────────────────
  {
    topic: 'Winter Shelter Program',
    description:
      'As temperatures drop, Chari-T is opening emergency shelters to ensure no one faces the cold alone this winter.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Shelter Locations',
        details:
          'We have secured 5 community centers across the city, providing warm beds, hot meals, and essential supplies to those experiencing homelessness.',
      },
      {
        topic: 'Volunteer Needs',
        details:
          'We need overnight volunteers, meal preparers, and donation sorters. Even a few hours can make a life-changing difference.',
      },
      {
        topic: 'Donation Drive',
        details:
          'We are collecting blankets, coats, gloves, and non-perishable food items. Every donation directly supports someone in need.',
      },
    ],
    img_url: 'https://picsum.photos/seed/winter-shelter/1584/396',
  },
  // ─── 7. Food Bank Expansion ───────────────────────────────────────
  {
    topic: 'Food Bank Expansion',
    description:
      "Chari-T's food bank is growing to serve even more families facing food insecurity in our community.",
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'New Facility',
        details:
          'Our new 10,000 sq ft warehouse will allow us to store and distribute 3x more fresh produce, dairy, and pantry staples.',
      },
      {
        topic: 'Mobile Pantries',
        details:
          'Three new mobile food pantries will bring groceries directly to underserved neighborhoods with limited transportation access.',
      },
      {
        topic: 'Partnership Growth',
        details:
          'We have partnered with 15 new local farms and grocery stores to rescue surplus food and reduce waste.',
      },
    ],
    img_url: 'https://picsum.photos/seed/food-bank/1584/396',
  },
  // ─── 8. Medical Mission to Rural Areas ────────────────────────────
  {
    topic: 'Medical Mission to Rural Areas',
    description:
      'A team of 25 healthcare professionals is bringing essential medical care to remote communities.',
    likes: 0,
    comments: 0,
    min_read: 6,
    content: [
      {
        topic: 'Services Provided',
        details:
          'Free health screenings, dental care, vision exams, and prescription medications to over 2,000 patients across 8 villages.',
      },
      {
        topic: 'Training Local Staff',
        details:
          'Our team is training 40 community health workers to continue basic care after the mission concludes.',
      },
      {
        topic: 'Equipment Donation',
        details:
          'We are leaving behind portable ultrasound machines, blood pressure monitors, and first aid kits for ongoing use.',
      },
    ],
    img_url: 'https://picsum.photos/seed/medical-mission/1584/396',
  },
  // ─── 9. Youth Mentorship Program ──────────────────────────────────
  {
    topic: 'Youth Mentorship Program',
    description:
      'Connecting at-risk youth with caring mentors who guide them toward brighter futures.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Program Structure',
        details:
          'Each mentee is paired with a trained volunteer mentor for weekly one-on-one sessions focused on academic and personal growth.',
      },
      {
        topic: 'Success Stories',
        details:
          '92% of participants improved their grades, and 78% reported increased confidence in their future prospects.',
      },
      {
        topic: 'How to Join',
        details:
          'We are recruiting 50 new mentors this semester. Training is provided, and the time commitment is just 2 hours per week.',
      },
    ],
    img_url: 'https://picsum.photos/seed/youth-mentor/1584/396',
  },
  // ─── 10. Animal Rescue Fundraiser ──────────────────────────────────
  {
    topic: 'Animal Rescue Fundraiser',
    description:
      'Help us save abandoned and injured animals through our emergency rescue and rehabilitation program.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Rescue Operations',
        details:
          'Our team responded to 340 emergency calls last year, rescuing dogs, cats, and wildlife from dangerous situations.',
      },
      {
        topic: 'Veterinary Care',
        details:
          'Every rescued animal receives full medical treatment, vaccinations, spay/neuter services, and microchipping.',
      },
      {
        topic: 'Adoption Events',
        details:
          'We host monthly adoption fairs where 85% of rehabilitated animals find loving forever homes.',
      },
    ],
    img_url: 'https://picsum.photos/seed/animal-rescue/1584/396',
  },
  // ─── 11. Disaster Relief Response ───────────────────────────────────
  {
    topic: 'Disaster Relief Response',
    description:
      'Chari-T mobilizes quickly when natural disasters strike, providing immediate aid to affected communities.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Rapid Deployment',
        details:
          'Within 24 hours of a disaster declaration, our trained response teams are on the ground distributing emergency supplies.',
      },
      {
        topic: 'Relief Supplies',
        details:
          'Each family receives a kit containing water, non-perishable food, hygiene products, blankets, and a solar-powered flashlight.',
      },
      {
        topic: 'Long-Term Recovery',
        details:
          'We stay for the long haul, helping families rebuild homes, replace lost documents, and access mental health support.',
      },
    ],
    img_url: 'https://picsum.photos/seed/disaster-relief/1584/396',
  },
  // ─── 12. Senior Care Initiative ─────────────────────────────────────
  {
    topic: 'Senior Care Initiative',
    description:
      'Ensuring our elderly community members receive the companionship and support they deserve.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Home Visits',
        details:
          'Trained volunteers visit isolated seniors weekly, providing conversation, meal preparation, and assistance with daily tasks.',
      },
      {
        topic: 'Wellness Checks',
        details:
          "Our nurses conduct monthly health screenings, medication reviews, and fall-risk assessments in seniors' homes.",
      },
      {
        topic: 'Social Activities',
        details:
          'Weekly bingo nights, gardening clubs, and tech tutoring sessions keep seniors engaged and connected.',
      },
    ],
    img_url: 'https://picsum.photos/seed/senior-care/1584/396',
  },
  // ─── 13. Environmental Cleanup Day ──────────────────────────────────
  {
    topic: 'Environmental Cleanup Day',
    description:
      'Join thousands of volunteers as we restore our local parks, rivers, and beaches to their natural beauty.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Cleanup Sites',
        details:
          'We are targeting 25 locations including 3 riverbanks, 8 parks, 10 neighborhoods, and 4 beach access points.',
      },
      {
        topic: 'Waste Collection',
        details:
          'Last year volunteers collected 12 tons of trash, 800 pounds of recyclables, and 200 pounds of hazardous waste.',
      },
      {
        topic: 'Native Planting',
        details:
          'After cleanup, teams will plant 5,000 native trees and wildflowers to restore natural habitats.',
      },
    ],
    img_url: 'https://picsum.photos/seed/env-cleanup/1584/396',
  },
  // ─── 14. Literacy for All Campaign ──────────────────────────────────
  {
    topic: 'Literacy for All Campaign',
    description:
      'Fighting illiteracy one book at a time. Our program provides reading resources to children and adults alike.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Mobile Libraries',
        details:
          'Three converted buses now serve as mobile libraries, visiting 40 neighborhoods weekly with 10,000+ books.',
      },
      {
        topic: 'Tutoring Programs',
        details:
          '200 trained tutors provide free one-on-one reading instruction to struggling students and adult learners.',
      },
      {
        topic: 'Book Donations',
        details:
          'We have distributed 45,000 books this year. Our goal is 100,000 by year-end with your help.',
      },
    ],
    img_url: 'https://picsum.photos/seed/literacy/1584/396',
  },
  // ─── 15. Mental Health Awareness Month ──────────────────────────────
  {
    topic: 'Mental Health Awareness Month',
    description:
      'Breaking the stigma and providing accessible mental health resources to everyone in our community.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Free Counseling',
        details:
          'We are offering 500 free counseling sessions this month. No insurance required, no questions asked.',
      },
      {
        topic: 'Support Groups',
        details:
          'New support groups for anxiety, depression, grief, and PTSD meet weekly both in-person and virtually.',
      },
      {
        topic: 'Youth Programs',
        details:
          'School-based mental health workshops have reached 3,000 students, teaching coping skills and emotional awareness.',
      },
    ],
    img_url: 'https://picsum.photos/seed/mental-health/1584/396',
  },
  // ─── 16. Housing First Program ────────────────────────────────────
  {
    topic: 'Housing First Program',
    description:
      'Providing stable housing as the foundation for individuals and families to rebuild their lives.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Apartment Partnerships',
        details:
          'We have partnered with 12 property managers to secure 200 affordable units for families transitioning from homelessness.',
      },
      {
        topic: 'Support Services',
        details:
          'Each family receives a case manager, job training referrals, childcare assistance, and budgeting workshops.',
      },
      {
        topic: 'Success Rate',
        details:
          '88% of participants remain housed after 12 months, compared to the national average of 55%.',
      },
    ],
    img_url: 'https://picsum.photos/seed/housing-first/1584/396',
  },
  // ─── 17. Arts for Healing Workshop ──────────────────────────────────
  {
    topic: 'Arts for Healing Workshop',
    description:
      'Using creative expression as therapy for trauma survivors, children in hospitals, and veterans.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Workshop Offerings',
        details:
          'Painting, pottery, music therapy, and creative writing classes led by professional art therapists.',
      },
      {
        topic: 'Hospital Programs',
        details:
          'Weekly bedside art sessions bring joy and distraction to 150 pediatric patients across 3 hospitals.',
      },
      {
        topic: 'Veteran Support',
        details:
          'Our veteran art studio provides a safe space for former service members to process experiences through creation.',
      },
    ],
    img_url: 'https://picsum.photos/seed/arts-healing/1584/396',
  },
  // ─── 18. Community Garden Network ─────────────────────────────────
  {
    topic: 'Community Garden Network',
    description: 'Growing food, community, and hope in neighborhoods across the city.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Garden Locations',
        details:
          '25 community gardens now operate on formerly vacant lots, transforming eyesores into vibrant green spaces.',
      },
      {
        topic: 'Food Production',
        details:
          'Collectively, our gardens produce 15,000 pounds of fresh vegetables annually, distributed free to local food pantries.',
      },
      {
        topic: 'Educational Programs',
        details:
          'Free gardening classes teach composting, organic pest control, and seed saving to over 500 residents each season.',
      },
    ],
    img_url: 'https://picsum.photos/seed/garden-network/1584/396',
  },
  // ─── 19. Refugee Welcome Center ───────────────────────────────────
  {
    topic: 'Refugee Welcome Center',
    description: 'Helping newly arrived families build new lives with dignity and support.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Arrival Support',
        details:
          'We provide temporary housing, language classes, cultural orientation, and connection to legal resources.',
      },
      {
        topic: 'Employment Services',
        details:
          'Job readiness training, resume workshops, and employer partnerships have helped 200 refugees find work.',
      },
      {
        topic: 'Community Integration',
        details:
          'Buddy programs pair refugee families with local volunteers for friendship and practical support.',
      },
    ],
    img_url: 'https://picsum.photos/seed/refugee-center/1584/396',
  },
  // ─── 20. STEM Education for Girls ─────────────────────────────────
  {
    topic: 'STEM Education for Girls',
    description:
      'Closing the gender gap in science and technology through hands-on learning experiences.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Coding Camps',
        details:
          'Free summer coding camps introduce 300 girls annually to programming, robotics, and web development.',
      },
      {
        topic: 'Mentor Network',
        details:
          '150 women working in STEM fields volunteer as mentors, providing career guidance and internship connections.',
      },
      {
        topic: 'Scholarship Fund',
        details:
          'We have awarded $250,000 in scholarships to young women pursuing degrees in engineering, computer science, and mathematics.',
      },
    ],
    img_url: 'https://picsum.photos/seed/stem-girls/1584/396',
  },
  // ─── 21. Emergency Blood Drive ──────────────────────────────────────
  {
    topic: 'Emergency Blood Drive',
    description:
      'Local blood supplies are critically low. Your donation can save up to three lives.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Current Need',
        details:
          'Hospitals report only a 2-day supply of O-negative blood. We need 500 donors this week to replenish stocks.',
      },
      {
        topic: 'Donation Sites',
        details:
          'Mobile units are stationed at 8 community centers, 3 universities, and 5 corporate campuses.',
      },
      {
        topic: 'Who Can Donate',
        details:
          'Most healthy adults over 17 can donate. The process takes 15 minutes, and every donor receives a wellness check.',
      },
    ],
    img_url: 'https://picsum.photos/seed/blood-drive/1584/396',
  },
  // ─── 22. Disability Access Fund ───────────────────────────────────
  {
    topic: 'Disability Access Fund',
    description: 'Removing barriers and creating inclusive spaces for people with disabilities.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Ramp Construction',
        details:
          'We have built 120 wheelchair ramps for homes and businesses, ensuring independence and compliance.',
      },
      {
        topic: 'Adaptive Equipment',
        details:
          'Our loan closet provides wheelchairs, walkers, and communication devices free of charge.',
      },
      {
        topic: 'Employment Advocacy',
        details:
          'We work with employers to create accessible workplaces and reasonable accommodations.',
      },
    ],
    img_url: 'https://picsum.photos/seed/disability-access/1584/396',
  },
  // ─── 23. Veterans Support Services ─────────────────────────────────
  {
    topic: 'Veterans Support Services',
    description:
      'Honoring those who served by providing comprehensive support for veterans and their families.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Housing Assistance',
        details:
          'We have helped 85 veterans secure permanent housing and provided rental assistance to 200 more.',
      },
      {
        topic: 'Job Placement',
        details:
          'Our veteran employment program has a 78% placement rate, connecting skills to civilian careers.',
      },
      {
        topic: 'Mental Health',
        details: 'Specialized PTSD counseling and peer support groups serve 400 veterans monthly.',
      },
    ],
    img_url: 'https://picsum.photos/seed/veterans/1584/396',
  },
  // ─── 24. Microfinance for Entrepreneurs ───────────────────────────
  {
    topic: 'Microfinance for Entrepreneurs',
    description:
      'Small loans creating big opportunities for aspiring business owners in underserved communities.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Loan Program',
        details:
          'Interest-free microloans from $500 to $5,000 help entrepreneurs start or expand small businesses.',
      },
      {
        topic: 'Business Training',
        details:
          'Free workshops cover bookkeeping, marketing, inventory management, and customer service.',
      },
      {
        topic: 'Success Stories',
        details:
          'Our 150 loan recipients have created 400 jobs and generated $2.5 million in local economic activity.',
      },
    ],
    img_url: 'https://picsum.photos/seed/microfinance/1584/396',
  },
  // ─── 25. Music Therapy Program ────────────────────────────────────
  {
    topic: 'Music Therapy Program',
    description:
      'Healing through melody. Our certified music therapists serve children with special needs and seniors with dementia.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Pediatric Services',
        details:
          'Weekly sessions help children with autism improve communication skills and reduce anxiety through structured musical activities.',
      },
      {
        topic: 'Dementia Care',
        details:
          'Personalized music playlists trigger memories and reduce agitation in 90% of participating seniors.',
      },
      {
        topic: 'Instrument Donation',
        details:
          'We collect and refurbish musical instruments for use in therapy sessions and school music programs.',
      },
    ],
    img_url: 'https://picsum.photos/seed/music-therapy/1584/396',
  },
  // ─── 26. Solar Power for Schools ──────────────────────────────────
  {
    topic: 'Solar Power for Schools',
    description:
      'Bringing renewable energy to underfunded schools while teaching students about sustainability.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Installation Progress',
        details:
          "Solar panels are now installed on 8 school rooftops, generating 40% of each school's electricity needs.",
      },
      {
        topic: 'Curriculum Integration',
        details:
          'Students monitor energy production in real-time, learning about renewable energy through hands-on STEM projects.',
      },
      {
        topic: 'Cost Savings',
        details:
          'Schools save an average of $18,000 annually on electricity, funds redirected to educational programs.',
      },
    ],
    img_url: 'https://picsum.photos/seed/solar-schools/1584/396',
  },
  // ─── 27. Domestic Violence Shelter ─────────────────────────────────
  {
    topic: 'Domestic Violence Shelter',
    description: 'A safe haven and comprehensive support system for survivors and their children.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Emergency Housing',
        details:
          'Our confidential shelter houses 40 families, providing safety, meals, and 24/7 security.',
      },
      {
        topic: 'Legal Advocacy',
        details:
          'On-site attorneys help survivors obtain protective orders, custody arrangements, and divorce proceedings.',
      },
      {
        topic: 'Economic Empowerment',
        details:
          'Job training, financial literacy classes, and emergency funds help survivors achieve independence.',
      },
    ],
    img_url: 'https://picsum.photos/seed/dv-shelter/1584/396',
  },
  // ─── 28. Youth Sports League ──────────────────────────────────────
  {
    topic: 'Youth Sports League',
    description:
      'Building character, teamwork, and healthy habits through organized sports for all children.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'League Structure',
        details:
          'Free soccer, basketball, and track programs serve 1,200 children ages 6-16 across 15 neighborhood parks.',
      },
      {
        topic: 'Equipment Program',
        details:
          'No child is turned away due to cost. We provide uniforms, shoes, and gear to every participant.',
      },
      {
        topic: 'Coach Training',
        details:
          'All 80 volunteer coaches complete certification in youth development, first aid, and positive coaching techniques.',
      },
    ],
    img_url: 'https://picsum.photos/seed/youth-sports/1584/396',
  },
  // ─── 29. Rural Education Initiative ─────────────────────────────────
  {
    topic: 'Rural Education Initiative',
    description: 'Bringing quality education resources to children in remote and rural areas.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'School Supplies',
        details:
          'We delivered 10,000 backpacks filled with supplies to 45 rural schools last semester.',
      },
      {
        topic: 'Teacher Support',
        details:
          'Monthly workshops and digital resource libraries help rural teachers access modern teaching methods.',
      },
      {
        topic: 'Technology Access',
        details:
          '500 tablets with pre-loaded educational content now reach students in areas without internet connectivity.',
      },
    ],
    img_url: 'https://picsum.photos/seed/rural-edu/1584/396',
  },
  // ─── 30. Nutrition Education Program ────────────────────────────────
  {
    topic: 'Nutrition Education Program',
    description: 'Teaching families how to cook healthy, affordable meals on any budget.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Cooking Classes',
        details:
          'Free hands-on classes teach meal planning, food safety, and preparation of nutritious low-cost recipes.',
      },
      {
        topic: 'Community Kitchens',
        details:
          'Three shared commercial kitchens allow food entrepreneurs and community groups to prepare meals at low cost.',
      },
      {
        topic: 'School Gardens',
        details:
          'Students grow vegetables in 20 school gardens, learning where food comes from while supplementing cafeteria meals.',
      },
    ],
    img_url: 'https://picsum.photos/seed/nutrition-edu/1584/396',
  },
  // ─── 31. Career Transition Workshop ─────────────────────────────────
  {
    topic: 'Career Transition Workshop',
    description:
      'Empowering individuals facing job loss with skills, confidence, and connections for their next chapter.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Resume Building',
        details:
          'Professional coaches help participants craft compelling resumes and optimize LinkedIn profiles.',
      },
      {
        topic: 'Interview Prep',
        details:
          'Mock interviews with HR professionals provide feedback and build confidence for real opportunities.',
      },
      {
        topic: 'Networking Events',
        details: 'Monthly job fairs connect 200+ job seekers with local employers actively hiring.',
      },
    ],
    img_url: 'https://picsum.photos/seed/career-workshop/1584/396',
  },
  // ─── 32. Foster Care Support ──────────────────────────────────────
  {
    topic: 'Foster Care Support',
    description:
      'Supporting foster families and children with resources, training, and community connection.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Family Training',
        details:
          'Comprehensive training covers trauma-informed care, behavior management, and navigating the foster system.',
      },
      {
        topic: 'Resource Closet',
        details:
          'Foster families access free clothing, toys, school supplies, and baby equipment as needs arise.',
      },
      {
        topic: 'Youth Activities',
        details:
          'Mentorship, tutoring, and extracurricular activity funding help foster youth thrive.',
      },
    ],
    img_url: 'https://picsum.photos/seed/foster-care/1584/396',
  },
  // ─── 33. Oral Health Clinic ───────────────────────────────────────
  {
    topic: 'Oral Health Clinic',
    description: 'Free dental care for uninsured and underinsured community members.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Services Offered',
        details:
          'Cleanings, fillings, extractions, and dentures provided by volunteer dentists and dental students.',
      },
      {
        topic: 'Patient Volume',
        details:
          'The clinic serves 150 patients monthly, with a waitlist indicating demand for expanded hours.',
      },
      {
        topic: 'Prevention Education',
        details:
          'School-based programs teach proper brushing, flossing, and nutrition for lifelong oral health.',
      },
    ],
    img_url: 'https://picsum.photos/seed/oral-health/1584/396',
  },
  // ─── 34. Urban Farming Project ────────────────────────────────────
  {
    topic: 'Urban Farming Project',
    description:
      'Transforming rooftops and vacant lots into productive urban farms feeding local communities.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Farm Locations',
        details:
          '10 rooftop gardens and 6 ground-level farms now operate across the city, producing 8 tons of food annually.',
      },
      {
        topic: 'Job Creation',
        details:
          'The project employs 25 formerly incarcerated individuals, providing agricultural training and living wages.',
      },
      {
        topic: 'Farmers Markets',
        details:
          'Produce is sold at sliding-scale prices in food deserts, with surplus donated to local shelters.',
      },
    ],
    img_url: 'https://picsum.photos/seed/urban-farm/1584/396',
  },
  // ─── 35. LGBTQ+ Youth Center ──────────────────────────────────────
  {
    topic: 'LGBTQ+ Youth Center',
    description: 'A safe, affirming space where LGBTQ+ young people can be their authentic selves.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Drop-In Services',
        details:
          'The center provides meals, showers, laundry, and clothing to 200 youth experiencing housing instability.',
      },
      {
        topic: 'Mental Health',
        details:
          'LGBTQ+-affirming counselors provide individual and group therapy addressing identity, family, and trauma.',
      },
      {
        topic: 'Leadership Development',
        details:
          'Youth councils plan events, advocate for policy change, and develop skills for future careers.',
      },
    ],
    img_url: 'https://picsum.photos/seed/lgbtq-youth/1584/396',
  },
  // ─── 36. Emergency Fund for Families ──────────────────────────────
  {
    topic: 'Emergency Fund for Families',
    description:
      'When crisis strikes, we provide rapid financial assistance to keep families housed and stable.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Crisis Response',
        details:
          'We approve emergency grants within 48 hours for rent, utilities, medical bills, and car repairs.',
      },
      {
        topic: 'Eligibility',
        details:
          'Families earning below 200% of federal poverty level facing unexpected hardship qualify for assistance.',
      },
      {
        topic: 'Prevention Impact',
        details:
          'Last year, emergency funds prevented 350 evictions and 200 utility shutoffs in our community.',
      },
    ],
    img_url: 'https://picsum.photos/seed/emergency-fund/1584/396',
  },
  // ─── 37. Digital Literacy Program ─────────────────────────────────
  {
    topic: 'Digital Literacy Program',
    description: 'Closing the digital divide by teaching essential technology skills to all ages.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Basic Skills',
        details:
          'Classes cover email, internet safety, video calls, and online banking for seniors and beginners.',
      },
      {
        topic: 'Device Distribution',
        details:
          'We have distributed 500 refurbished laptops and tablets to families without computer access.',
      },
      {
        topic: 'Job Search Support',
        details:
          'Advanced workshops teach online job searching, application completion, and virtual interview skills.',
      },
    ],
    img_url: 'https://picsum.photos/seed/digital-literacy/1584/396',
  },
  // ─── 38. Maternal Health Initiative ─────────────────────────────────
  {
    topic: 'Maternal Health Initiative',
    description: 'Supporting mothers and babies through comprehensive prenatal and postnatal care.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Prenatal Care',
        details:
          'Free prenatal vitamins, screenings, and doula services for 300 expectant mothers annually.',
      },
      {
        topic: 'Birth Support',
        details:
          'Trained doulas attend births, advocating for mothers and reducing unnecessary medical interventions.',
      },
      {
        topic: 'Postpartum Care',
        details:
          'Lactation support, mental health screening, and newborn care classes for the critical first year.',
      },
    ],
    img_url: 'https://picsum.photos/seed/maternal-health/1584/396',
  },
  // ─── 39. Community Policing Dialogue ────────────────────────────────
  {
    topic: 'Community Policing Dialogue',
    description:
      'Building trust and understanding between law enforcement and the communities they serve.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Dialogue Sessions',
        details:
          'Monthly facilitated conversations bring officers and residents together to address concerns and build relationships.',
      },
      {
        topic: 'Youth Programs',
        details:
          'Police athletic leagues and mentorship programs connect officers with young people in positive settings.',
      },
      {
        topic: 'Policy Advocacy',
        details:
          'Community input shapes department policies on use of force, bias training, and accountability measures.',
      },
    ],
    img_url: 'https://picsum.photos/seed/policing-dialogue/1584/396',
  },
  // ─── 40. Reentry Support Program ────────────────────────────────────
  {
    topic: 'Reentry Support Program',
    description: 'Helping formerly incarcerated individuals successfully reintegrate into society.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Housing Assistance',
        details:
          'We operate 3 transitional houses and help participants secure permanent housing upon release.',
      },
      {
        topic: 'Employment Pathways',
        details:
          'Partnerships with fair-chance employers result in 65% job placement within 90 days of release.',
      },
      {
        topic: 'Legal Aid',
        details:
          "Pro bono attorneys help with record expungement, driver's license restoration, and child support modifications.",
      },
    ],
    img_url: 'https://picsum.photos/seed/reentry-support/1584/396',
  },
  // ─── 41. Language Exchange Program ──────────────────────────────────
  {
    topic: 'Language Exchange Program',
    description:
      'Connecting immigrants and locals through mutual language learning and cultural exchange.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Conversation Partners',
        details:
          'English learners are paired with native speakers for weekly practice sessions, building fluency and friendships.',
      },
      {
        topic: 'Cultural Events',
        details:
          'Monthly potlucks, holiday celebrations, and museum visits celebrate the diversity of our community.',
      },
      {
        topic: 'Citizenship Prep',
        details:
          'Free classes prepare permanent residents for the citizenship exam and interview process.',
      },
    ],
    img_url: 'https://picsum.photos/seed/language-exchange/1584/396',
  },
  // ─── 42. Special Olympics Partnership ───────────────────────────────
  {
    topic: 'Special Olympics Partnership',
    description:
      'Empowering athletes with intellectual disabilities through sports training and competition.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Training Programs',
        details:
          'Year-round coaching in basketball, swimming, track, and bowling for 400 athletes.',
      },
      {
        topic: 'Health Screenings',
        details:
          'Free fitness assessments, vision exams, and dental checkups at every training facility.',
      },
      {
        topic: 'Unified Sports',
        details:
          'Teams combining athletes with and without disabilities promote inclusion and break down barriers.',
      },
    ],
    img_url: 'https://picsum.photos/seed/special-olympics/1584/396',
  },
  // ─── 43. Community Radio Station ────────────────────────────────────
  {
    topic: 'Community Radio Station',
    description:
      'A voice for the voiceless. Our nonprofit radio station amplifies local stories and emergency information.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Programming',
        details:
          'Local news, immigrant language shows, youth DJ hours, and live coverage of community events.',
      },
      {
        topic: 'Emergency Broadcasts',
        details:
          'During crises, the station provides real-time updates on shelters, road closures, and resource distribution.',
      },
      {
        topic: 'Youth Training',
        details:
          'Free broadcasting workshops teach 50 teens annually about journalism, audio production, and media literacy.',
      },
    ],
    img_url: 'https://picsum.photos/seed/community-radio/1584/396',
  },
  // ─── 44. Eye Care Mission ─────────────────────────────────────────
  {
    topic: 'Eye Care Mission',
    description:
      'Restoring sight and dignity through free eye exams and glasses for the uninsured.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Screening Events',
        details:
          'Mobile clinics provide comprehensive eye exams to 1,000 patients at community centers and schools.',
      },
      {
        topic: 'Free Glasses',
        details:
          'On-site labs manufacture prescription glasses in under an hour, with 800 pairs distributed last year.',
      },
      {
        topic: 'Cataract Surgeries',
        details:
          'We fund 50 cataract surgeries annually for patients who would otherwise face permanent blindness.',
      },
    ],
    img_url: 'https://picsum.photos/seed/eye-care/1584/396',
  },
  // ─── 45. Climate Resilience Project ─────────────────────────────────
  {
    topic: 'Climate Resilience Project',
    description:
      'Preparing vulnerable communities for the impacts of climate change through adaptation and education.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Heat Response',
        details:
          'Cooling centers, hydration stations, and wellness checks protect seniors during extreme heat events.',
      },
      {
        topic: 'Flood Preparation',
        details:
          'Sandbag distribution, elevation grants, and emergency evacuation planning for flood-prone neighborhoods.',
      },
      {
        topic: 'Green Infrastructure',
        details:
          'Rain gardens, permeable pavement, and urban tree canopy projects reduce flooding and lower temperatures.',
      },
    ],
    img_url: 'https://picsum.photos/seed/climate-resilience/1584/396',
  },
  // ─── 46. Toy Drive for Children ─────────────────────────────────────
  {
    topic: 'Toy Drive for Children',
    description:
      'Ensuring every child experiences the joy of receiving a gift during the holiday season.',
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: 'Collection Goal',
        details:
          'We aim to collect 5,000 new toys for children ages 0-16 in foster care, shelters, and low-income families.',
      },
      {
        topic: 'Drop-off Locations',
        details:
          '50 businesses, schools, and churches serve as collection points across the metro area.',
      },
      {
        topic: 'Distribution Events',
        details:
          'Parents shop free toy stores with dignity, choosing gifts their children will love.',
      },
    ],
    img_url: 'https://picsum.photos/seed/toy-drive/1584/396',
  },
  // ─── 47. Substance Recovery Housing ─────────────────────────────────
  {
    topic: 'Substance Recovery Housing',
    description: 'Safe, supportive housing for individuals rebuilding their lives after addiction.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'Sober Living Homes',
        details:
          '4 houses provide structured, substance-free housing for 40 residents transitioning from treatment.',
      },
      {
        topic: 'Peer Support',
        details:
          'Residents mentor each other through recovery, attending meetings together and holding each other accountable.',
      },
      {
        topic: 'Employment Bridge',
        details:
          'Partnerships with recovery-friendly employers help residents find work and rebuild financial stability.',
      },
    ],
    img_url: 'https://picsum.photos/seed/recovery-housing/1584/396',
  },
  // ─── 48. Elder Abuse Prevention ─────────────────────────────────────
  {
    topic: 'Elder Abuse Prevention',
    description:
      'Protecting vulnerable seniors from financial exploitation, neglect, and physical abuse.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Hotline Services',
        details:
          'Our 24/7 confidential hotline received 800 calls last year, triggering immediate protective interventions.',
      },
      {
        topic: 'Financial Safeguards',
        details:
          'We train bank tellers, pharmacists, and postal workers to recognize and report signs of elder financial abuse.',
      },
      {
        topic: 'Legal Protection',
        details:
          'Pro bono attorneys help seniors create powers of attorney, wills, and advance directives to prevent exploitation.',
      },
    ],
    img_url: 'https://picsum.photos/seed/elder-abuse/1584/396',
  },
  // ─── 49. First Responder Wellness ───────────────────────────────────
  {
    topic: 'First Responder Wellness',
    description:
      'Supporting the mental and physical health of firefighters, police, and EMTs who serve our community.',
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: 'Peer Support',
        details:
          'Trained peer counselors who understand the unique stresses of emergency work provide confidential support.',
      },
      {
        topic: 'Family Programs',
        details:
          "Spouse support groups and children's camps help families cope with the demands of first responder life.",
      },
      {
        topic: 'Fitness Initiatives',
        details:
          'Free gym memberships, nutrition counseling, and sleep hygiene workshops address the physical toll of shift work.',
      },
    ],
    img_url: 'https://picsum.photos/seed/first-responder/1584/396',
  },
  // ─── 50. Global Education Fund ──────────────────────────────────────
  {
    topic: 'Global Education Fund',
    description:
      'Building schools and providing scholarships in developing nations to break the cycle of poverty.',
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: 'School Construction',
        details:
          'We have built 12 schools in rural areas, serving 3,000 students who previously had no access to education.',
      },
      {
        topic: 'Scholarship Program',
        details:
          '500 girls receive full scholarships covering tuition, uniforms, books, and meals through high school.',
      },
      {
        topic: 'Teacher Training',
        details:
          'We train 200 local teachers annually in modern pedagogy, classroom management, and subject expertise.',
      },
    ],
    img_url: 'https://picsum.photos/seed/global-edu/1584/396',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '4', 10);

  // Validate inputs
  const validPage = Math.max(1, page);
  const validLimit = Math.min(Math.max(1, limit), 20); // cap at 20 per page

  const totalBlogs = BLOG_DATA.length;
  const totalPages = Math.ceil(totalBlogs / validLimit);
  const safePage = Math.min(validPage, totalPages);

  const startIndex = (safePage - 1) * validLimit;
  const endIndex = Math.min(startIndex + validLimit, totalBlogs);
  const paginatedData = BLOG_DATA.slice(startIndex, endIndex);

  return NextResponse.json(
    {
      blogs: totalBlogs,
      page: safePage,
      limit: validLimit,
      totalPages: totalPages,
      data: paginatedData,
    },
    { status: 200 },
  );
}
