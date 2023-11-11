import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { getCookie } from "cookies-next";
import { Book } from "@prisma/client";

function Input(props: {
  id: string;
  label: string;
  type: string;
  value?: any;
  required?: boolean;
  min?: number;
  max?: number;
  handle_change: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="w-full grid gap-2 sm:gap-0 sm:grid-cols-3 items-center">
      <label htmlFor={props.id}>
        {props.label}
        {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        value={props.value}
        required={props.required}
        min={props.min}
        max={props.max}
        onChange={props.handle_change}
        className={`input-field col-span-2 focus-outline
                            ${props.type == "checkbox" ? "w-5 h-5" : ""}
                            ${props.type == "textbox" ? "h-32" : ""}`}
      />
    </div>
  );
}

function ArrayInput(props: {
  id: string;
  label: string;
  required?: boolean;
  handle_change: (name: string, value: any[]) => void;
}) {
  const [items, set_items] = useState<string[]>([]);
  const [new_item, set_new_item] = useState<string>("");
  const input_ref = useRef(null);

  function handle_submit() {
    if (new_item == "") return;
    set_items((current_items) => [...current_items, new_item]);
    set_new_item("");
  }

  function delete_element(index: number) {
    set_items((current_items) => {
      const items_copy = Array.from(current_items);
      items_copy.splice(index, 1);
      return items_copy;
    });
  }

  useEffect(() => {
    props.handle_change(props.id, items);
  }, [items]);

  return (
    <div className="w-full grid sm:grid-cols-6 items-center">
      <label htmlFor={props.id} className="col-span-2">
        {props.label}
        {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        id={props.id}
        ref={input_ref}
        value={new_item}
        onKeyDown={(event) => {
          if (event.key == "Enter") {
            event.preventDefault();
            if (document.activeElement == input_ref.current) {
              handle_submit();
            }
          }
        }}
        onChange={(event) => {
          set_new_item(event.target.value);
        }}
        className="input-field col-span-3 mr-4"
      />

      <input
        type="button"
        onClick={handle_submit}
        value="Lägg till"
        className="btn-primary"
      />
      <div className="col-span-2"></div>
      <ul className="flex flex-wrap gap-2 col-span-4 mt-4">
        {items.map((item, index) => (
          <li
            key={index}
            className={`flex items-center rounded-full bg-zinc-200 dark:bg-zinc-700 px-2 py-1 pointer-events-none 
                                                hover:bg-red-700 hover:dark:bg-red-300 hover:text-red-50 hover:dark:text-red-900 transition-colors overflow-hidden`}
          >
            <button
              onMouseUp={() => delete_element(index)}
              onTouchEnd={() => delete_element(index)}
              className="w-4 h-4 leading-4 text-lg mr-1 rounded-full pointer-events-auto"
            >
              ⨯
            </button>

            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AddForm(props: { reset: () => void }) {
  const [state, set_state] = useState<Partial<Book>>({});

  function handle_submit(event: FormEvent) {
    event.preventDefault();

    if (
      !(
        (state.authors && state.authors.length < 0) ||
        (state.themes && state.themes.length)
      )
    ) {
      return;
    }

    fetch("/api/add", {
      method: "POST",
      body: JSON.stringify({
        book_data: state,
        admin_key: getCookie("admin_key"),
      }),
    }).then((res) => {
      if (res.status == 200) {
        props.reset();
      }
    });
  }

  function handle_change(event: ChangeEvent<HTMLInputElement>) {
    const name = event.target.name;
    let value: any =
      event.target.type != "checkbox"
        ? event.target.value
        : event.target.checked;

    if (event.target.type == "number") {
      value = parseInt(value);
    }

    set_state((current_state) => ({ ...current_state, [name]: value }));
  }

  function handle_array_change(name: string, value: any[]) {
    set_state((current_state) => ({ ...current_state, [name]: value }));
  }

  return (
    <form
      onSubmit={handle_submit}
      className="p-8 rounded border border-zinc-300 dark:border-zinc-700 max-w-xl flex flex-col gap-4"
    >
      <Input
        type="text"
        id="title"
        label="Titel"
        required
        handle_change={handle_change}
      />
      <ArrayInput
        id="authors"
        label="Författare"
        required
        handle_change={handle_array_change}
      />
      <ArrayInput
        id="tags"
        label="Taggar"
        required
        handle_change={handle_array_change}
      />
      <Input
        type="number"
        id="chapter_length"
        label="Kapitellängd"
        required
        min={1}
        handle_change={handle_change}
      />
      <Input
        type="number"
        id="difficulty"
        label="Svårighetsgrad"
        required
        min={1}
        max={60}
        handle_change={handle_change}
      />
      <Input
        type="number"
        id="age_lower"
        label="Från ålder"
        required
        min={1}
        handle_change={handle_change}
      />
      <Input
        type="number"
        id="age_upper"
        label="Till ålder"
        required
        min={1}
        handle_change={handle_change}
      />
      <Input
        type="text"
        id="illustrations"
        label="Illustrationer"
        required
        handle_change={handle_change}
      />
      <Input
        type="textbox"
        id="comment"
        label="Kommentar"
        handle_change={handle_change}
      />
      <Input
        type="checkbox"
        id="part_of_series"
        label="Del av serie"
        handle_change={handle_change}
      />
      {state.part_of_series && (
        <>
          <Input
            type="text"
            id="series"
            label="Serie"
            handle_change={handle_change}
          />
          <Input
            type="number"
            id="part_in_series"
            label="Del i serie"
            min={1}
            handle_change={handle_change}
          />
          <Input
            type="number"
            id="total_parts_in_series"
            label="Antal delar i serie"
            min={1}
            handle_change={handle_change}
          />
        </>
      )}
      <Input
        type="textbox"
        id="first_paragraph"
        label="Första stycket"
        handle_change={handle_change}
      />
      <ArrayInput
        id="awards"
        label="Priser/utmärkelser"
        handle_change={handle_array_change}
      />
      <Input
        type="text"
        id="teachers_guide"
        label="Lärarhandledning"
        handle_change={handle_change}
      />
      <Input
        type="checkbox"
        id="filmatized"
        label="Filmatiserad"
        handle_change={handle_change}
      />

      <input type="submit" className="btn-primary" value="Lägg till bok" />
    </form>
  );
}
