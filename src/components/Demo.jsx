import React from "react";
import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";
import { MdDelete } from "react-icons/md";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

 
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("article")
    );
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
    // console.log(articlesFromLocalStorage);
  }, []);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("article", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyText) => {
    setCopied(copyText);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDeleteHistory = () => {
    localStorage.removeItem("article");
    setAllArticles([]);
  };

  const handleDeleteArticle = (article) => {
    localStorage.removeItem("article");
    
    const filteredArticles = allArticles.filter(function(a) {
      return a.url !== article.url
    });
    // console.log("printing article" ,article)
    
    setAllArticles(filteredArticles)
    // console.log(filteredArticles)
    localStorage.setItem("article", JSON.stringify(filteredArticles));
  }
  return (
    <section className="mt-16 w-full max-w-xl">
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />

          <input
            type="url"
            placeholder="Enter a URl"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            required
            className="url_input peer"
          />

          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ⏎
          </button>
        </form>
        {allArticles.length > 0  &&
          <div className="flex justify-end">
          <button onClick={handleDeleteHistory} className="black_btn">
            Delete History
          </button>
        </div>}

        {/* Browse URL History */}
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              
              className="link_card"
            >
              <div
                onClick={() => handleCopy(item.url)}
                className="copy_btn"
              >
                <img
                  src={ copied === item?.url? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p 
              onClick={() => setArticle(item)}
              className=" flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
              <button
              onClick={() => handleDeleteArticle(item)}
              >
                <MdDelete />
              </button>
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
            Well that wasn't suppose to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <div
                  onClick={() => handleCopy(article?.summary)}
                  className="copy_btn"
                >
                  <img
                    src={copied === article?.summary ? tick : copy}
                    alt="copy_icon"
                    className="w-[40%] h-[40%] object-contain"
                  />
                </div>
              </div>
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
