const Footer = () => {
  return (
    <div>
      <footer className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col not-only-of-type:justify-between gap-4 py-6 text-sm text-[#68716a]  
        sm:flex-row sm:items-center sm:justify-between">
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
