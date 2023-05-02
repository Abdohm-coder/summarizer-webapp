import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

type Article = { url: string; summary: string };

const Demo = () => {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  const [allArticles, setAllArticles] = useState<Array<Article>>([]);
  const [copied, setCopied] = useState("");
  const [article, setArticle] = useState<Article>({
    url: "",
    summary: "",
  });

  useEffect(() => {
    const articlesFormLocalStorage = JSON.parse(
      localStorage.getItem("articles") as string
    );

    if (articlesFormLocalStorage) setAllArticles(articlesFormLocalStorage);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updateAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updateAllArticles);

      // Update Locale Storage
      localStorage.setItem("articles", JSON.stringify(updateAllArticles));
    }
  };

  const handleCopy = (copyUrl: string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}>
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Enter a URL"
            value={article.url}
            onChange={(e) =>
              setArticle((prev) => ({ ...prev, url: e.target.value }))
            }
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700">
            <p>↵</p>
          </button>
        </form>
        {/* Browser URL history */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((el, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(el)}
              className="link_card">
              <div className="copy_btn" onClick={() => handleCopy(el.url)}>
                <img
                  src={copied === el.url ? tick : copy}
                  alt="copy icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {el.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen... <br />{" "}
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
