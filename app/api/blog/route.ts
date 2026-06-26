import { NextRequest, NextResponse } from "next/server";




const BLOG_DATA = [
  {
    topic: "New Years Eve with Chari-T",
    description: "Join us for a spectacular evening of giving and celebration as we ring in the new year together with our amazing community of donors and volunteers.",
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: "Event Highlights",
        details: "The evening featured live performances from local artists, a silent auction with over 50 items, and heartfelt stories from beneficiaries who have been impacted by your generosity over the past year."
      },
      {
        topic: "Fundraising Results",
        details: "Thanks to your incredible support, we raised over $150,000 during the event — exceeding our goal by 30%. These funds will directly support education programs in underserved communities."
      },
      {
        topic: "Looking Ahead",
        details: "As we step into the new year, we're excited to announce three new partnership programs that will expand our reach to 5,000 additional families across the region."
      }
    ],
    img_url: "https://picsum.photos/seed/charity-nye/1584/396"
  },
  {
    topic: "Community Drive Success",
    description: "Our latest community drive brought together hundreds of volunteers to make a real difference in local neighborhoods.",
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: "Volunteer Stories",
        details: "Over 200 volunteers dedicated their weekend to sorting donations, preparing meals, and distributing essential supplies to families in need."
      },
      {
        topic: "Impact Metrics",
        details: "We distributed 5,000+ meals, 1,200 hygiene kits, and 800 winter clothing packages to families across 12 different neighborhoods."
      }
    ],
    img_url: "https://picsum.photos/seed/community-drive/1584/396"
  },
  {
    topic: "Technology for Good Initiative",
    description: "Exploring how modern technology can bridge gaps and create opportunities for charitable organizations worldwide.",
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: "Digital Transformation",
        details: "Nonprofits are increasingly adopting cloud-based solutions to streamline operations, reduce overhead costs, and improve donor engagement through data-driven insights."
      },
      {
        topic: "AI in Philanthropy",
        details: "Machine learning algorithms now help identify the most effective intervention strategies by analyzing historical outcome data and predicting community needs."
      },
      {
        topic: "Blockchain Transparency",
        details: "Smart contracts and distributed ledgers are revolutionizing how donors track their contributions, ensuring every dollar reaches its intended destination with full accountability."
      }
    ],
    img_url: "https://picsum.photos/seed/tech-good/1584/396"
  },
  {
    topic: "Clean Water Project Launch",
    description: "Chari-T is proud to announce our new initiative to bring clean, safe drinking water to rural communities in need.",
    likes: 0,
    comments: 0,
    min_read: 4,
    content: [
      {
        topic: "Project Overview",
        details: "In partnership with local engineers and health organizations, we are building 12 new water wells and filtration systems across three underserved regions."
      },
      {
        topic: "Community Involvement",
        details: "Local residents are actively participating in the construction and maintenance training, ensuring long-term sustainability and community ownership of the project."
      },
      {
        topic: "Expected Impact",
        details: "This project will provide clean water access to over 3,500 people, significantly reducing waterborne illness rates and improving overall quality of life."
      }
    ],
    img_url: "https://picsum.photos/seed/clean-water/1584/396"
  },
  {
    topic: "Back-to-School Supply Drive",
    description: "Help us equip every child with the tools they need to succeed this school year. Our annual supply drive is now live.",
    likes: 0,
    comments: 0,
    min_read: 3,
    content: [
      {
        topic: "What We Need",
        details: "We are collecting backpacks, notebooks, pencils, calculators, and art supplies to distribute to students from low-income families before the new term begins."
      },
      {
        topic: "How to Donate",
        details: "Drop off supplies at any of our 8 local collection centers, or contribute online and we will purchase items on your behalf at wholesale prices."
      },
      {
        topic: "Last Year's Success",
        details: "Thanks to donors like you, we provided fully stocked backpacks to over 1,200 students last year, and we aim to reach 1,500 this year."
      }
    ],
    img_url: "https://picsum.photos/seed/back-to-school/1584/396"
  }
];

export async function GET(){
  

     return NextResponse.json(
              BLOG_DATA,
              {status
                :200
              }
         )

}