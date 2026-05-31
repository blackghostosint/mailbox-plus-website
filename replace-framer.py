import re
import os

# Files to process (from earlier search)
files = [
    "/home/blackghost/mailbox-plus-website/src/components/ServicePageV2.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/layout/Header.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/PickupHours.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Services.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Tracking.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ContactUs.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ShippingPartners.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/StoreHours.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Privacy.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/fedex-easy-returns.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Home.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/AboutUs.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/ask-mailbox-plus.tsx",
    "/home/blackghost/mailbox-plus-website/src/pages/Terms.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/PremierSignupModal.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/Button.tsx",
    "/home/blackghost/mailbox-plus-website/src/components/ui/SearchBox.tsx",
]

def replace_framer_motion(file_path):
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        original_content = content
        
        # Remove framer-motion import (various formats)
        patterns = [
            r"import\s*\{\s*motion(?:,\s*AnimatePresence)?(?:\s*,\s*type\s*MotionProps)?\s*\}\s*from\s*'framer-motion';\s*\n",
            r"import\s*\{\s*AnimatePresence\s*,\s*motion\s*\}\s*from\s*'framer-motion';\s*\n",
            r"import\s*\{\s*motion\s*,\s*type\s*MotionProps\s*\}\s*from\s*'framer-motion';\s*\n",
        ]
        for pattern in patterns:
            content = re.sub(pattern, "", content)
        
        # Replace motion elements with regular HTML elements
        # motion.div -> div with animation class
        content = re.sub(r"<motion\.div([^>]*)>", r'<div\1 className="animate-fade-in-up">', content)
        content = re.sub(r"</motion\.div>", "</div>", content)
        
        # motion.section -> section
        content = re.sub(r"<motion\.section([^>]*)>", r'<section\1 className="animate-fade-in-up">', content)
        content = re.sub(r"</motion\.section>", "</section>", content)
        
        # motion.header -> header
        content = re.sub(r"<motion\.header([^>]*)>", r'<header\1 className="animate-fade-in-up">', content)
        content = re.sub(r"</motion\.header>", "</header>", content)
        
        # AnimatePresence tags (remove them)
        content = re.sub(r"<AnimatePresence[^>]*>", "", content)
        content = re.sub(r"</AnimatePresence>", "", content)
        
        # Remove MotionProps type references
        content = re.sub(r":\s*MotionProps", "", content)
        
        if content != original_content:
            with open(file_path, 'w') as f:
                f.write(content)
            print(f"Updated: {os.path.basename(file_path)}")
        else:
            print(f"No changes: {os.path.basename(file_path)}")
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

for file in files:
    if os.path.exists(file):
        replace_framer_motion(file)
    else:
        print(f"File not found: {file}")

print("Done replacing framer-motion usage.")
