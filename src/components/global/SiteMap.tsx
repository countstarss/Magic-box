import React from 'react';

const SiteMap = () => {
  return (
    <div className="bg-gray-50 py-10 px-6 rounded-lg"
      //MARK: SITE MAP
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* For Clients */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For Clients</h3>
          <ul className="space-y-2 text-gray-600">
            <li>How Fiverr Works</li>
            <li>Customer Success Stories</li>
            <li>Trust & Safety</li>
            <li>Quality Guide</li>
            <li>Fiverr Learn</li>
            <li>Fiverr Guides</li>
            <li>Fiverr Answers</li>
          </ul>
        </div>

        {/* For Freelancers */}
        <div>
          <h3 className="text-lg font-semibold mb-4">For Freelancers</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Become a Fiverr Freelancer</li>
            <li>Become an Agency</li>
            <li>Kickstart</li>
            <li>Community Hub</li>
            <li>Forum</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Business Solutions */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Business Solutions</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Fiverr Pro</li>
            <li>Project Management Service</li>
            <li>ClearVoice</li>
            <li>Working Not Working</li>
            <li>AutoDS</li>
            <li>Fiverr Logo Maker</li>
            <li>Contact Sales</li>
          </ul>
        </div>
        
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li>About Fiverr</li>
            <li>Help & Support</li>
            <li>Social Impact</li>
            <li>Careers</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Partnerships</li>
            <li>Creator Network</li>
            <li>Affiliates</li>
            <li>Invite a Friend</li>
            <li>Press & News</li>
            <li>Investor Relations</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default SiteMap;
