"use client"

import Explain from "@/app/components/layout/explain";
import { Logo } from "@/app/components/layout/footer";
import NavBar from "@/app/components/layout/NavBar";
import Button from "@/app/components/ui/button";
import { ChevronLeft, ChevronRight, Heart, MessageCircleCode, Timer, Send, User } from "lucide-react";
import { useCallback, useState } from "react";

// ─── Unified Data Type ─────────────────────────────────────────────
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

// ─── Dummy Data (Fixed Structure) ──────────────────────────────────
const DUMMY_BLOG_CARDS: BlogCard[] = [
  {
    topic: "New Release Apache 2.0 (Bug fixes)",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam.",
    likes: 0,
    comments: 0,
    min_read: 5,
    content: [
      {
        topic: "How it works",
        details: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure."
      },
      {
        topic: "Key Improvements",
        details: "Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat ipsum voluptate quasi ea iure."
      },
      {
        topic: "Migration Guide",
        details: "Quaerat ipsum voluptate quasi ea iure. Vitae minus iure harum error fugiat excepturi debitis quia sapiente, suscipit consequatur quam, hic sed ipsam."
      }
    ],
    img_url: "https://picsum.photos/seed/apache-release/1584/396"
  },
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
  }
];

// ─── Comment Type ──────────────────────────────────────────────────
type Comment = {
  id: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  likes: number;
};

// ─── Mock Comments Data ────────────────────────────────────────────
const MOCK_COMMENTS: Record<number, Comment[]> = {
  0: [
    { id: 1, author: "Sarah Chen", avatar: "https://picsum.photos/seed/sarah/100/100", text: "Great update! The bug fixes have really improved performance on our end.", timestamp: "2 hours ago", likes: 12 },
    { id: 2, author: "Mike Ross", avatar: "https://picsum.photos/seed/mike/100/100", text: "Looking forward to the migration guide. When will the full documentation be available?", timestamp: "5 hours ago", likes: 8 },
    { id: 3, author: "Emma Wilson", avatar: "https://picsum.photos/seed/emma/100/100", text: "The key improvements section is exactly what we needed. Thanks team!", timestamp: "1 day ago", likes: 24 }
  ],
  1: [
    { id: 1, author: "David Park", avatar: "https://picsum.photos/seed/david/100/100", text: "What an incredible evening! Proud to be part of this community.", timestamp: "3 hours ago", likes: 45 },
    { id: 2, author: "Lisa Thompson", avatar: "https://picsum.photos/seed/lisa/100/100", text: "The silent auction items were amazing. Can't wait for next year!", timestamp: "6 hours ago", likes: 18 }
  ],
  2: [
    { id: 1, author: "James Miller", avatar: "https://picsum.photos/seed/james/100/100", text: "Volunteered last weekend. The organization was top-notch!", timestamp: "1 day ago", likes: 33 }
  ],
  3: [
    { id: 1, author: "Anna Kowalski", avatar: "https://picsum.photos/seed/anna/100/100", text: "Blockchain transparency is the future of charitable giving. Exciting times!", timestamp: "4 hours ago", likes: 67 },
    { id: 2, author: "Tom Bradley", avatar: "https://picsum.photos/seed/tom/100/100", text: "Would love to see a case study on the AI implementation results.", timestamp: "8 hours ago", likes: 21 },
    { id: 3, author: "Nina Patel", avatar: "https://picsum.photos/seed/nina/100/100", text: "Digital transformation is crucial for smaller nonprofits with limited staff.", timestamp: "12 hours ago", likes: 15 },
    { id: 4, author: "Chris Anderson", avatar: "https://picsum.photos/seed/chris/100/100", text: "Great overview of the tech landscape in philanthropy.", timestamp: "1 day ago", likes: 9 }
  ]
};

export default function Page() {
  const [stage, setStage] = useState<1 | 2>(1);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Record<number, Comment[]>>(MOCK_COMMENTS);
  const [likedSections, setLikedSections] = useState<Set<string>>(new Set());

  const activeCard = DUMMY_BLOG_CARDS[activeCardIndex];

  const handleViewMore = (index: number) => {
    setActiveCardIndex(index);
    setStage(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStage(1);
    setCommentText("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: Date.now(),
      author: "You",
      avatar: "https://picsum.photos/seed/you/100/100",
      text: commentText.trim(),
      timestamp: "Just now",
      likes: 0
    };

    setLocalComments(prev => ({
      ...prev,
      [activeCardIndex]: [...(prev[activeCardIndex] || []), newComment]
    }));
    setCommentText("");
  };

  const toggleSectionLike = (sectionTopic: string) => {
    setLikedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionTopic)) {
        next.delete(sectionTopic);
      } else {
        next.add(sectionTopic);
      }
      return next;
    });
  };

  // ─── ORIGINAL Card Design (Preserved Exactly) ────────────────────
  const blog_cards = useCallback((cards: BlogCard) => {
    return (
      <div className="w-full mb-4 text-black shadow-xl rounded flex flex-col bg-white">
        <div className="w-full h-40">
          <img className="object-cover w-full h-full" src={cards.img_url} alt={cards.topic} />
        </div>
        <div className="p-4">
          <div className="font-bold text-2xl line-clamp-2 mb-3">
            {cards.topic}
          </div>
          <div className="text-xs flex justify-start gap-2 mb-3">
            <div className="rounded-full w-6 h-6 border-2 border-gray-600 overflow-hidden">
              <img src="https://picsum.photos/seed/charit-logo/100/100" alt="" className="object-cover w-full h-full" />
            </div>
            <div className="text-gray-700 my-auto">
              <Explain details="A Crowdfunding application" topic="Chari-T" />
            </div>
            <span 
              className="inline-flex items-center transition-transform duration-300 hover:scale-110 my-auto" 
              title="Verified Charity"
            >
              <svg className="h-5 w-5 text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            </span>
          </div>
          <div className="text-gray-700 text-sm mb-3 line-clamp-4">
            {cards.description}
          </div>
          <div className="flex justify-start gap-4">
            <div className="flex text-gray-700 text-sm gap-2">
              <Heart size={20} /> {Math.floor(Math.random() * 10000)}
            </div>
            <div className="flex text-gray-700 text-sm gap-2">
              <MessageCircleCode size={20} /> {Math.floor(Math.random() * 300)}
            </div>
            <div className="flex text-gray-700 text-sm gap-2">
              <Timer size={20} /> {cards.min_read} mins read
            </div>
          </div>
          <Button 
            onClick={() => handleViewMore(DUMMY_BLOG_CARDS.indexOf(cards))} 
            className="mt-4" 
            details={<span className="flex gap-2">View More <ChevronRight /></span>} 
            variant="secondary" 
          />
        </div>
      </div>
    );
  }, []);

  // ─── Stage 2: Full Blog Post Reader (Mobile Optimized) ───────────
  const BlogReader = () => {
    const comments = localComments[activeCardIndex] || [];

    return (
      <div className="min-h-screen bg-white">
        {/* Hero Banner - Mobile Responsive */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
          <img 
            src={activeCard.img_url} 
            alt={activeCard.topic}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/90 hover:text-white mb-2 sm:mb-4 transition-colors text-sm font-medium"
              >
                <ChevronLeft size={16} className="sm:size-[18px]" /> 
                <span className="hidden sm:inline">Back to Blog</span>
                <span className="sm:hidden">Back</span>
              </button>
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                {activeCard.topic}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/80 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-white/30">
                    <img src="https://picsum.photos/seed/charit-logo/100/100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <span>Chari-T Team</span>
                </div>
                <span className="hidden sm:inline">•</span>
                <span>{activeCard.min_read} min read</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          {/* Description */}
          <div className="text-base sm:text-lg text-gray-700 leading-relaxed mb-8 sm:mb-10 border-l-4 border-gray-900 pl-4 sm:pl-6 italic">
            {activeCard.description}
          </div>

          {/* Story Content - Mapped Array */}
          <div className="space-y-8 sm:space-y-10">
            {activeCard.content.map((section, idx) => (
              <article key={idx} className="scroll-mt-20" id={`section-${idx}`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-2">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 flex items-start gap-2 sm:gap-3">
                    <span className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-900 text-white text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5 sm:mt-0">
                      {idx + 1}
                    </span>
                    <span>{section.topic}</span>
                  </h2>
                  <button
                    onClick={() => toggleSectionLike(section.topic)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all self-start sm:self-auto ${
                      likedSections.has(section.topic)
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Heart size={12} className={likedSections.has(section.topic) ? "fill-red-600" : ""} />
                    {likedSections.has(section.topic) ? "Liked" : "Like"}
                  </button>
                </div>
                
                <div className="prose prose-sm sm:prose-lg max-w-none text-gray-700 leading-relaxed pl-8 sm:pl-11">
                  {section.details.split('\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="mb-3 sm:mb-4">{paragraph}</p>
                  ))}
                </div>

                {/* Section Divider */}
                {idx < activeCard.content.length - 1 && (
                  <div className="mt-6 sm:mt-10 border-b border-gray-200" />
                )}
              </article>
            ))}
          </div>

          {/* Engagement Stats */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart size={18} className="sm:size-[20px]" />
                  <span className="font-medium text-sm sm:text-base">{Math.floor(Math.random() * 1000) + 100} likes</span>
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircleCode size={18} className="sm:size-[20px]" />
                  <span className="font-medium text-sm sm:text-base">{comments.length} comments</span>
                </button>
              </div>
              <Button
                onClick={handleBack}
                details={<span className="flex items-center gap-2"><ChevronLeft size={16} /> Back to Blog</span>}
                variant="secondary"
              />
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 sm:mt-12 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <MessageCircleCode size={18} className="sm:size-[22px]" />
              Comments ({comments.length})
            </h3>

            {/* Comment Input */}
            <div className="flex gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="sm:size-[20px] text-gray-500" />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none min-h-[80px] sm:min-h-[100px] text-sm"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={12} className="sm:size-[14px]" /> 
                    <span className="hidden sm:inline">Post Comment</span>
                    <span className="sm:hidden">Post</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4 sm:space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={comment.avatar} alt={comment.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1.5 sm:mb-2 gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                          {comment.author === "You" && (
                            <span className="px-1.5 sm:px-2 py-0.5 bg-gray-900 text-white text-[10px] sm:text-xs rounded-full">You</span>
                          )}
                        </div>
                        <span className="text-[10px] sm:text-xs text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{comment.text}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2 ml-1 sm:ml-2">
                      <button className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 hover:text-red-500 transition-colors">
                        <Heart size={10} className="sm:size-[12px]" /> {comment.likes}
                      </button>
                      <button className="text-[10px] sm:text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8 sm:py-10 text-gray-400">
                  <MessageCircleCode size={32} className="sm:size-[40px] mx-auto mb-2 sm:mb-3 opacity-30" />
                  <p className="text-sm">No comments yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Posts Navigation */}
          <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">More Stories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {DUMMY_BLOG_CARDS.filter((_, idx) => idx !== activeCardIndex).slice(0, 2).map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCardIndex(DUMMY_BLOG_CARDS.indexOf(card));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left bg-white"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={card.img_url} alt={card.topic} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm mb-1">{card.topic}</h4>
                    <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">{card.description}</p>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 sm:mt-2 block">{card.min_read} min read</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Main Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {stage === 1 && (
        <main className="min-h-screen pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h1 className="text-2xl sm:text-3xl flex-col gap-2 sm:gap-4 font-bold text-gray-900 mb-2">
                <div className="mb-2 sm:mb-4"><Logo /></div>
                Blog Posts
              </h1>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui possimus culpa, cupiditate officia expedita saepe dicta modi. Aut numquam asperiores sunt iure molestiae atque dolorem facere, debitis animi laborum quas.
              </p>
            </div>

            {/* ORIGINAL Layout: flex-col on mobile, md:flex-row on tablet+ */}
            <div className="flex-col flex md:flex-row gap-3 sm:gap-4">
              {DUMMY_BLOG_CARDS.map((card, index) => (
                <div key={index} className="w-full md:flex-1">
                  {blog_cards(card)}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12 mb-4 sm:mb-6">
              <button
                className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-1.5 px-1 sm:px-2">
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-900 bg-gray-900 text-white shadow-sm transition-all">
                  1
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  2
                </button>
                <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  3
                </button>
                <span className="px-1 text-gray-400 text-xs sm:text-sm">...</span>
              </div>

              <button
                className="flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        </main>
      )}

      {stage === 2 && <BlogReader />}
    </div>
  );
}