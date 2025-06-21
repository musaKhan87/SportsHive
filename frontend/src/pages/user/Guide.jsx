"use client";

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Calendar,
  MapPin,
  Shield,
  Star,
  MessageCircle,
  ArrowLeft,
  Play,
  CheckCircle,
  Award,
  Heart,
  Zap,
  Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Guide = () => {
  const navigate = useNavigate();
  const {isAdmin}=useAuth()
  const [openSections, setOpenSections] = useState({
    gettingStarted: true,
    findingEvents: false,
    creatingEvents: false,
    safety: false,
    community: false,
    advanced: false,
  });

  const toggleSection = (section) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section],
    });
  };

  const guideData = {
    gettingStarted: {
      title: "Getting Started",
      icon: <Users size={24} />,
      color: "from-green-400 to-blue-500",
      content: [
        {
          title: "Create Your Profile",
          description:
            "Set up your profile with your sports interests, skill level, and location to help others find you.",
          steps: [
            "Click 'Sign up' to create your account with email verification",
            "Add a profile photo and write a compelling bio about yourself",
            "Select your favorite sports and indicate your skill levels",
            "Set your location to find nearby events and connect with local athletes",
            "Complete your profile to increase visibility by 300%",
          ],
        },
        {
          title: "Explore the Platform",
          description:
            "Get familiar with all the features SportsHive has to offer.",
          steps: [
            "Browse the dashboard to see personalized recommendations",
            "Check out trending events in your area",
            "Review the community guidelines and safety tips",
            "Join your first event to start building connections",
          ],
        },
      ],
    },
    findingEvents: {
      title: "Finding Perfect Events",
      icon: <Calendar size={24} />,
      color: "from-purple-400 to-pink-500",
      content: [
        {
          title: "Smart Search & Filters",
          description:
            "Use our advanced search tools to find events that match your preferences perfectly.",
          steps: [
            "Use the search bar with keywords like sport type, location, or skill level",
            "Apply multiple filters: date range, distance, participant count, and difficulty",
            "Save your favorite search criteria for quick access",
            "Set up notifications for events matching your interests",
            "Use the map view to see events in your vicinity",
          ],
        },
        {
          title: "Event Details & Reviews",
          description:
            "Make informed decisions by thoroughly reviewing event information.",
          steps: [
            "Read detailed event descriptions and requirements carefully",
            "Check organizer ratings and previous event reviews",
            "Review participant list and skill levels",
            "Verify location accessibility and parking availability",
            "Contact organizers directly if you have specific questions",
          ],
        },
      ],
    },
    creatingEvents: {
      title: "Creating Amazing Events",
      icon: <MapPin size={24} />,
      color: "from-yellow-400 to-orange-500",
      content: [
        {
          title: "Event Planning Mastery",
          description:
            "Create events that attract participants and build lasting sports communities.",
          steps: [
            "Choose clear, exciting titles that describe the activity and vibe",
            "Write detailed descriptions including skill level, equipment needed, and what to expect",
            "Select optimal times considering work schedules and weather",
            "Choose accessible locations with adequate facilities and parking",
            "Set realistic participant limits based on venue and activity type",
            "Add high-quality photos to make your event stand out",
          ],
        },
        {
          title: "Successful Event Management",
          description:
            "Best practices for running events that participants love and want to repeat.",
          steps: [
            "Send welcome messages to new participants with event details",
            "Create group chats for easy communication and coordination",
            "Prepare backup plans for weather or venue issues",
            "Arrive early to set up and greet participants",
            "Follow up after events to gather feedback and plan future activities",
            "Build a community around regular events and activities",
          ],
        },
      ],
    },
    safety: {
      title: "Safety & Security",
      icon: <Shield size={24} />,
      color: "from-red-400 to-pink-500",
      content: [
        {
          title: "Personal Safety Guidelines",
          description:
            "Essential safety practices for participating in sports events with new people.",
          steps: [
            "Always meet in public, well-lit locations with good visibility",
            "Inform trusted friends or family about your event plans and location",
            "Trust your instincts - leave immediately if you feel uncomfortable",
            "Bring appropriate safety equipment for your specific sport",
            "Stay hydrated and know your physical limits",
            "Keep emergency contacts easily accessible on your phone",
          ],
        },
        {
          title: "Event Safety Protocols",
          description:
            "Guidelines for maintaining safety during sports activities.",
          steps: [
            "Warm up properly and stretch before any physical activity",
            "Follow all venue rules and safety regulations",
            "Respect other participants and maintain good sportsmanship",
            "Report any unsafe behavior or conditions to event organizers",
            "Have a first aid plan and know the location of nearest medical facilities",
            "Use proper technique and equipment to prevent injuries",
          ],
        },
      ],
    },
    community: {
      title: "Building Community",
      icon: <MessageCircle size={24} />,
      color: "from-blue-400 to-purple-500",
      content: [
        {
          title: "Being an Outstanding SportsHive",
          description:
            "How to be a positive, valued member of the SportsHive community.",
          steps: [
            "Be respectful, inclusive, and welcoming to participants of all skill levels",
            "Communicate clearly and respond to messages promptly",
            "Show up on time, prepared, and with a positive attitude",
            "Offer encouragement and constructive feedback to fellow athletes",
            "Help newcomers feel welcome and included in activities",
            "Share your knowledge and experience generously with others",
          ],
        },
        {
          title: "Building Lasting Connections",
          description:
            "Strategies for developing meaningful friendships through sports.",
          steps: [
            "Be open to meeting people from diverse backgrounds and skill levels",
            "Participate regularly in events to build familiarity and trust",
            "Organize informal meetups and social activities outside of formal events",
            "Support and celebrate other community members' achievements",
            "Create group chats or social media groups for ongoing communication",
            "Plan progressive skill-building activities for regular participants",
          ],
        },
      ],
    },
    advanced: {
      title: "Advanced Features",
      icon: <Zap size={24} />,
      color: "from-indigo-400 to-purple-500",
      content: [
        {
          title: "Pro Tips & Hidden Features",
          description:
            "Advanced techniques to maximize your SportsHive experience.",
          steps: [
            "Use the buddy matching system to find compatible long-term sports partners",
            "Create recurring events to build a consistent community",
            "Utilize the review system to build your reputation and credibility",
            "Join multiple sports communities to diversify your activities",
            "Use the calendar integration to never miss important events",
            "Leverage social sharing to grow your events and community",
          ],
        },
        {
          title: "Leadership & Growth",
          description:
            "How to become a community leader and grow the sports ecosystem.",
          steps: [
            "Mentor new users and help them navigate the platform",
            "Organize special events like tournaments or skill workshops",
            "Collaborate with local businesses and venues for better events",
            "Provide feedback to help improve the platform for everyone",
            "Build partnerships with other event organizers",
            "Share success stories and inspire others to stay active",
          ],
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          {isAdmin && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Go Back
            </button>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SportsHive Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master every aspect of SportsHive and become part of an amazing
              sports community
            </p>
          </div>
        </div>

        {/* Quick Success Tips */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl p-8 mb-12 text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="mr-3" />
            Quick Success Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <Star size={24} className="text-yellow-300" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-sm opacity-90">
                  Complete profiles get 3x more event invitations and
                  connections
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <Users size={24} className="text-blue-300" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Stay Active</h3>
                <p className="text-sm opacity-90">
                  Regular participation builds stronger, lasting sports
                  friendships
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <Calendar size={24} className="text-green-300" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Plan Ahead</h3>
                <p className="text-sm opacity-90">
                  Book popular events early and set up recurring activities
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="p-2 bg-white/20 rounded-lg mr-4">
                <Heart size={24} className="text-pink-300" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Be Inclusive</h3>
                <p className="text-sm opacity-90">
                  Welcome newcomers and create an inclusive environment for all
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guide Sections */}
        <div className="space-y-6">
          {Object.entries(guideData).map(([key, section]) => (
            <div
              key={key}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/20"
            >
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/50 transition-all"
              >
                <div className="flex items-center">
                  <div
                    className={`p-3 bg-gradient-to-r ${section.color} rounded-xl mr-4 shadow-lg`}
                  >
                    <div className="text-white">{section.icon}</div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="flex items-center">
                  {openSections[key] && (
                    <span className="mr-3 text-sm text-green-600 font-medium">
                      Expanded
                    </span>
                  )}
                  {openSections[key] ? (
                    <ChevronDown size={24} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={24} className="text-gray-500" />
                  )}
                </div>
              </button>

              {openSections[key] && (
                <div className="px-8 pb-8 border-t border-gray-100">
                  <div className="space-y-8 mt-8">
                    {section.content.map((item, index) => (
                      <div key={index} className="bg-white/50 rounded-xl p-6">
                        <div className="flex items-start mb-4">
                          <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg mr-4">
                            <Play size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {item.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start">
                              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 text-white text-sm rounded-full flex items-center justify-center mr-4 mt-0.5 shadow-md">
                                {stepIndex + 1}
                              </div>
                              <span className="text-gray-700 leading-relaxed">
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced FAQ Section */}
        <div className="mt-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  How do I cancel my participation?
                </h3>
                <p className="text-gray-600">
                  Go to "My Events" → "Events I Joined" → Click "Leave Event".
                  Please cancel at least 24 hours in advance to be considerate
                  to other participants and the organizer.
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  What if I need to cancel my event?
                </h3>
                <p className="text-gray-600">
                  Go to "My Events" → "Events I Created" → Click the delete
                  button. All participants will be automatically notified via
                  email and in-app notifications.
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  How do I report inappropriate behavior?
                </h3>
                <p className="text-gray-600">
                  Click the "Report" button on any user profile or event page.
                  Our moderation team reviews all reports within 24 hours and
                  takes appropriate action.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Can I create private events?
                </h3>
                <p className="text-gray-600">
                  Currently all events are public to encourage community
                  building. However, you can control participation through skill
                  level requirements, participant limits, and approval settings.
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  How does the buddy matching work?
                </h3>
                <p className="text-gray-600">
                  Our algorithm matches you with compatible sports partners
                  based on location, interests, skill level, and availability.
                  Check your dashboard for personalized recommendations.
                </p>
              </div>

              <div className="bg-white/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  What about weather cancellations?
                </h3>
                <p className="text-gray-600">
                  Event organizers can update events with weather information.
                  We recommend having backup indoor plans and clear
                  communication with participants about weather policies.
                </p>
              </div>
            </div>
          </div>
        </div>

      

        {/* Contact Support */}
        <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our dedicated support team is here to help you make the most of
            SportsHive. We're committed to ensuring you have the best possible
            experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NavLink
              to={"/contact"}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg font-medium"
            >
              Contact Support
            </NavLink>
            <a
              href="#"
              className="px-8 py-3 bg-white text-green-600 border-2 border-green-500 rounded-xl hover:bg-green-50 transition-all font-medium"
            >
              View Full FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;
