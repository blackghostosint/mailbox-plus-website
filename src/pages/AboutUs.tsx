import { motion } from "framer-motion";
import { fadeUp } from "../utils/animations";
import { SmartImage } from "../components/SmartImage";
import { getServiceImageUrl } from "../utils/getServiceImageUrl";

export default function AboutUs() {
  return (
    <div className="pb-20 pt-10 max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        About Mailbox Plus
      </h1>

      {/* SECTION 1 – Mailboxes image */}
      <motion.div {...fadeUp(0.15)} className="relative mb-12">
        <SmartImage
          src={getServiceImageUrl("/images/mailboxes.webp")}
          alt="A wall of secure, private mailboxes at Mailbox Plus"
          className="transform rotate-6 transition-transform duration-300 hover:rotate-0 rounded-2xl shadow-lg w-full aspect-video object-cover"
        />
      </motion.div>

      {/* SECTION 2 – Frank */}
      <motion.div
        {...fadeUp(0.3)}
        className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto mb-10"
      >
        <SmartImage
          src={getServiceImageUrl("/images/frank.webp")}
          alt="Frank Schwarz, Store Manager at Mailbox Plus"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center">Frank Schwarz</h2>
        <p className="text-center text-gray-600">Store Manager</p>
      </motion.div>

      {/* SECTION 3 – Diana */}
      <motion.div
        {...fadeUp(0.4)}
        className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto"
      >
        <SmartImage
          src={getServiceImageUrl("/images/diana.webp")}
          alt="Diana Goebelt, Owner of Mailbox Plus"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center">Diana Goebelt</h2>
        <p className="text-center text-gray-600">Owner</p>
      </motion.div>
    </div>
  );
}
