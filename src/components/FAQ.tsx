import { faqData } from "../data/data";
import { useState } from "react";

const FAQ = () => {
  const [faqItems] = useState(Object.values(faqData));

  return (
    <>
      <div className="flex justify-center">
        <div className="w-6/12">
          {faqItems.map((item) => (
            <div className="collapse rounded-md mb-5">
              <input type="checkbox" />
              <div className="collapse-title bg-white/20 text-primary-content  peer-checked:bg-white/10 peer-checked:text-secondary-content">
                {item.header}
              </div>
              <div className="collapse-content bg-white/10 text-primary-content peer-checked:bg-white/5 peer-checked:text-secondary-content">
                <p className="mt-4">{item.text}</p>

                {item.text2 != "" ? (
                  <div>
                    <p>{item.text2}</p>
                  </div>
                ) : (
                  ""
                )}
                {item.text3 != "" ? (
                  <div>
                    <p>{item.text3}</p>
                  </div>
                ) : (
                  ""
                )}
                {item.link != "" ? (
                  <div>
                    <br />
                    <p>
                      Read more:
                      <a
                        className=" text-cyan-500 hover:text-cyan-300"
                        href={item.link}
                        target="_blank"
                      >
                        {" "}
                        {item.link}
                      </a>
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default FAQ;
