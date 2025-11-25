import { SmartImage } from "../components/SmartImage";
// ...
          <motion.div {...fadeUp(0.15)} className="relative">
            <SmartImage
              src={getServiceImageUrl("/images/mailboxes.webp")}
              alt="A wall of secure, private mailboxes at Mailbox Plus"
              className="transform rotate-6 transition-transform duration-300 hover:rotate-0 rounded-2xl shadow-lg w-full aspect-video object-cover"
            />
          </motion.div>
//...
            <motion.div {...fadeUp(0.3)} className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
              <SmartImage
                src={getServiceImageUrl("/images/frank.webp")}
                alt="Frank Schwarz, Store Manager at Mailbox Plus"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
//...
            <motion.div {...fadeUp(0.4)} className="bg-white p-8 rounded-2xl shadow-sm max-w-md mx-auto">
              <SmartImage
                src={getServiceImageUrl("/images/diana.webp")}
                alt="Diana Goebelt, Owner of Mailbox Plus"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
//...
