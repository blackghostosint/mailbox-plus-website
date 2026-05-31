import re
import os

files = [
    "/home/blackghost/mailbox-plus-website/src/components/ServicePageV2.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/Button.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Services.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ShippingPartners.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ask-mailbox-plus.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Terms.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/AboutUs.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ContactUs.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/StoreHours.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Privacy.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Home.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Tracking.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/PickupHours.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/layout/Header.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/PremierSignupModal.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/SearchBox.tsx",
]

def replace_all_motion(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        original = content
        
        # Remove all framer-motion imports
        content = re.sub(
            r"import\s*\{\s*[^}]*\}\s*from\s*'framer-motion';\s*\n",
            "",
            content
        )
        
        # Replace motion.<element> with <element className="animate-fade-in-up">
        # Match motion.anytag with attributes
        content = re.sub(
            r"<motion\.([a-zA-Z0-9]+)([^>]*)>",
            r'<\1\2 className="animate-fade-in-up">',
            content
        )
        
        # Replace </motion.anytag> with </tag>
        content = re.sub(
            r"</motion\.([a-zA-Z0-9]+)>",
            r"</\1>",
            content
        )
        
        # Remove AnimatePresence tags
        content = re.sub(r"<AnimatePresence[^>]*>", "", content)
        content = re.sub(r"</AnimatePresence>", "", content)
        
        # Remove MotionProps type references
        content = re.sub(r":\s*MotionProps", "", content)
        
        # Fix Button.tsx specific: replace motion.button, motion.div etc in ternaries
        content = re.sub(r"motion\.([a-zA-Z0-9]+)", r"\1", content)
        
        if content != original:
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"Updated: {os.path.basename(file_path)}")
        else:
            print(f"No changes: {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"Error {file_path}: {e}")

for f in files:
    if os.path.exists(f):
        replace_all_motion(f)
    else:
        print(f"Missing: {f}")

print("Done.")