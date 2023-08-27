import React, { useState, useEffect, useRef, useCallback } from "react";
import Tables from "../components/Tables/Tables";

import { createClient } from "@supabase/supabase-js";

import { useNavigate } from "react-router-dom";

import Modal from "react-modal";
import { atom, useAtom } from "jotai";

import axios from "axios";

export const ingredientsAtom = atom([]);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

const userid = localStorage.getItem("userid");

const BASE_URL = `https://node-recipe-api.onrender.com/recipe?userId=`;
const deploy = true;
const BASE_URL2 = deploy
  ? "https://docker-test-shec.onrender.com"
  : "http://localhost:8000";
function Inventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [ingredients, setIngredients] = useAtom(ingredientsAtom);

  console.log(ingredients);

  useEffect(() => {
    async function getInventory() {
      var { data, error } = await supabase
        .from("user_food")
        .select("*, food(*)")
        .eq("userId", userid)
        .order("expires_in");
      if (error) {
        console.log(error);
        // alert("Error");
      }

      const formattedData = data.map((item) => {
        return {
          id: item.food.id,
          name: item.food.name,
          quantity: item.quantity,
          expires_in: item.expires_in,
          created_at: item.created_at,
        };
      });

      console.log(formattedData);

      setInventory(formattedData);
    }

    getInventory();
  }, []);

  function generateRecipe() {
    console.log("h");
    axios
      .get(`${BASE_URL}${userid}`)
      .then((res) => {
        res = res.data;
        console.log(res);
        axios
          .post(`${BASE_URL2}/RecipeSteps`, {
            input: JSON.stringify(res),
          })
          .then(async (res) => {
            let ingredientList = res.data;
            console.log(res.data);
            for await (let ingredient of ingredientList) {
              var { data, error } = await supabase.from("recipe").insert({
                name: ingredient["label"],
                userId: userid,
                data: ingredient,
              });
              if (error) {
                console.log(error);
              } else {
                console.log(data);
              }
            }
            navigate("/recipe");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
    overlay: {
      zIndex: 100,
    },
  };

  return (
    <>
      <div className="flex justify-between items-center  mb-2">
        <div className="font-bold text-lg">What you currently have: </div>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="my-auto flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          + Add New
        </button>
      </div>
      <Tables data={inventory} />
      {inventory.length > 0 ? (
        <>
          <button
            onClick={() => {
              console.log(ingredients);
              openModal();
            }}
            className="m-auto mb-10 flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Make Food
          </button>
          <Modal
            isOpen={modalIsOpen}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            style={customStyles}
          >
            <h1 className="text-bold">
              Selected Ingredients that will be cooked:
            </h1>
            <div className="flex flex-col items-center justify-center mt-3 h-[100px]">
              <div className="grow flex flex-col items-center justify-center">
                {ingredients.length > 0 ? (
                  ingredients.map((e, idx) => {
                    return (
                      <div key={"ing" + idx} className="font-bold text-lg">
                        {e}
                      </div>
                    );
                  })
                ) : (
                  <div className="font-bold text-lg">
                    No Ingredients Selected
                  </div>
                )}
              </div>
              <button
                className="mx-auto flex w-fit justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => {
                  generateRecipe();
                }}
              >
                Generate Recipes
              </button>
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
    </>
  );
}

export default Inventory;
