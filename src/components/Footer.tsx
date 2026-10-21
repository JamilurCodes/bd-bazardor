/* 

### 7. Footer
- Match the Figma.
- **Left**: `বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।`
- **Right**: *“সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”*
 */
const Footer = () => {
  return (
    <div>
      <footer className="site-footer">
        <div className="wrap footer-inner flex flex-row justify-around gap-4 py-6 text-sm text-[#68716a]">
          <p>
            <strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
