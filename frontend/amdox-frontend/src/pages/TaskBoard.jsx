import {
  useEffect,
  useMemo,
  useState,
} from "react";

import API from "../services/api";

export default function TaskBoard() {

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const [newTask, setNewTask] =
    useState({
      title: "",
      description: "",
      priority: "MEDIUM",
    });

  const columns = [
    "TODO",
    "IN_PROGRESS",
    "DONE",
  ];

  // ================= FETCH TASKS =================

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks =
    async () => {

      try {

        const res =
          await API.get(
            "/tasks"
          );

        setTasks(
          res.data
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= CREATE TASK =================

  const createTask =
    async (e) => {

      e.preventDefault();

      try {

        setCreating(true);

        await API.post(
          "/tasks",
          {
            ...newTask,
            status: "TODO",
          }
        );

        setNewTask({
          title: "",
          description: "",
          priority: "MEDIUM",
        });

        fetchTasks();

      } catch (err) {

        console.log(err);

        alert(
          "Failed to create task"
        );

      } finally {

        setCreating(false);

      }

    };

  // ================= UPDATE STATUS =================

  const updateStatus =
    async (
      taskId,
      status
    ) => {

      try {

        await API.put(
          `/tasks/${taskId}`,
          { status }
        );

        setTasks((prev) =>
          prev.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  status,
                }
              : task
          )
        );

      } catch (err) {

        console.log(err);

        alert(
          "Failed to update task"
        );

      }

    };

  // ================= SEARCH FILTER =================

  const filteredTasks =
    useMemo(() => {

      return tasks.filter(
        (task) =>
          task.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          task.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [tasks, search]);

  // ================= PRIORITY STYLE =================

  const priorityStyle =
    (priority) => {

      switch (priority) {

        case "HIGH":

          return `
            bg-red-100
            text-red-700
          `;

        case "MEDIUM":

          return `
            bg-yellow-100
            text-yellow-700
          `;

        case "LOW":

          return `
            bg-green-100
            text-green-700
          `;

        default:

          return `
            bg-gray-100
            text-gray-700
          `;

      }

    };

  // ================= COLUMN STYLE =================

  const columnStyle =
    (column) => {

      switch (column) {

        case "TODO":

          return `
            border-blue-200
            bg-blue-50/60
          `;

        case "IN_PROGRESS":

          return `
            border-yellow-200
            bg-yellow-50/60
          `;

        case "DONE":

          return `
            border-green-200
            bg-green-50/60
          `;

        default:

          return `
            border-gray-200
            bg-gray-50
          `;

      }

    };

  // ================= STATS =================

  const todoCount =
    tasks.filter(
      (t) =>
        t.status === "TODO"
    ).length;

  const progressCount =
    tasks.filter(
      (t) =>
        t.status ===
        "IN_PROGRESS"
    ).length;

  const doneCount =
    tasks.filter(
      (t) =>
        t.status === "DONE"
    ).length;

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-indigo-600
          via-violet-600
          to-purple-600
          rounded-3xl
          p-8
          text-white
          shadow-2xl
        "
      >

        <h1 className="text-4xl font-black">

          Project Task Board

        </h1>

        <p className="mt-2 text-indigo-100">

          Manage team workflow
          and task progress

        </p>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            p-6
            shadow-lg
          "
        >

          <p className="text-gray-500">

            Todo Tasks

          </p>

          <h2
            className="
              text-5xl
              font-black
              text-blue-600
              mt-3
            "
          >

            {todoCount}

          </h2>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-6
            shadow-lg
          "
        >

          <p className="text-gray-500">

            In Progress

          </p>

          <h2
            className="
              text-5xl
              font-black
              text-yellow-500
              mt-3
            "
          >

            {progressCount}

          </h2>

        </div>

        <div
          className="
            bg-white
            rounded-3xl
            p-6
            shadow-lg
          "
        >

          <p className="text-gray-500">

            Completed

          </p>

          <h2
            className="
              text-5xl
              font-black
              text-green-600
              mt-3
            "
          >

            {doneCount}

          </h2>

        </div>

      </div>

      {/* CREATE TASK */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-xl
          p-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-black
              "
            >

              Create Task

            </h2>

            <p className="text-gray-500 mt-1">

              Add new project tasks

            </p>

          </div>

        </div>

        <form
          onSubmit={createTask}
          className="space-y-5"
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "
          >

            {/* TITLE */}

            <input
              type="text"
              placeholder="Task title"
              required
              value={newTask.title}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title:
                    e.target.value,
                })
              }
              className="
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                outline-none
                focus:border-violet-500
              "
            />

            {/* PRIORITY */}

            <select
              value={
                newTask.priority
              }
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority:
                    e.target.value,
                })
              }
              className="
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                outline-none
                focus:border-violet-500
              "
            >

              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

            </select>

          </div>

          {/* DESCRIPTION */}

          <textarea
            rows="4"
            placeholder="Task description..."
            value={
              newTask.description
            }
            onChange={(e) =>
              setNewTask({
                ...newTask,
                description:
                  e.target.value,
              })
            }
            className="
              w-full
              border
              border-gray-300
              rounded-2xl
              px-5
              py-4
              outline-none
              resize-none
              focus:border-violet-500
            "
          />

          {/* BUTTON */}

          <button
            type="submit"
            disabled={creating}
            className="
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              text-white
              px-8
              py-4
              rounded-2xl
              font-bold
              hover:scale-105
              transition-all
              disabled:opacity-50
            "
          >

            {

              creating
                ? "Creating..."
                : "Create Task"

            }

          </button>

        </form>

      </div>

      {/* SEARCH */}

      <div
        className="
          bg-white
          rounded-3xl
          shadow-lg
          p-5
        "
      >

        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            border
            border-gray-300
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-violet-500
          "
        />

      </div>

      {/* TASK BOARD */}

      {

        loading ? (

          <div
            className="
              bg-white
              rounded-3xl
              shadow-xl
              p-20
              text-center
            "
          >

            <h2
              className="
                text-3xl
                font-black
              "
            >

              Loading Tasks...

            </h2>

          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
            "
          >

            {

              columns.map(
                (column) => (

                  <div
                    key={column}
                    className={`
                      rounded-3xl
                      border
                      p-5
                      min-h-[600px]
                      ${columnStyle(
                        column
                      )}
                    `}
                  >

                    {/* HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-6
                      "
                    >

                      <h2
                        className="
                          text-xl
                          font-black
                        "
                      >

                        {

                          column.replace(
                            "_",
                            " "
                          )

                        }

                      </h2>

                      <div
                        className="
                          bg-white
                          h-10
                          w-10
                          rounded-full
                          flex
                          items-center
                          justify-center
                          font-bold
                          shadow
                        "
                      >

                        {

                          filteredTasks.filter(
                            (task) =>
                              task.status ===
                              column
                          ).length

                        }

                      </div>

                    </div>

                    {/* TASKS */}

                    <div className="space-y-4">

                      {

                        filteredTasks
                          .filter(
                            (task) =>
                              task.status ===
                              column
                          )
                          .map(
                            (task) => (

                              <div
                                key={
                                  task._id
                                }
                                className="
                                  bg-white
                                  rounded-3xl
                                  p-5
                                  shadow-lg
                                  hover:shadow-2xl
                                  transition-all
                                "
                              >

                                {/* TITLE */}

                                <div
                                  className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-4
                                  "
                                >

                                  <h3
                                    className="
                                      text-lg
                                      font-black
                                    "
                                  >

                                    {

                                      task.title

                                    }

                                  </h3>

                                  <span
                                    className={`
                                      px-3
                                      py-1
                                      rounded-full
                                      text-xs
                                      font-bold
                                      whitespace-nowrap
                                      ${priorityStyle(
                                        task.priority
                                      )}
                                    `}
                                  >

                                    {

                                      task.priority ||

                                      "MEDIUM"

                                    }

                                  </span>

                                </div>

                                {/* DESC */}

                                <p
                                  className="
                                    text-gray-500
                                    mt-3
                                    text-sm
                                    leading-relaxed
                                  "
                                >

                                  {

                                    task.description ||

                                    "No description"

                                  }

                                </p>

                                {/* FOOTER */}

                                <div
                                  className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    gap-2
                                  "
                                >

                                  {

                                    columns.map(
                                      (
                                        status
                                      ) => (

                                        <button
                                          key={
                                            status
                                          }
                                          onClick={() =>
                                            updateStatus(
                                              task._id,
                                              status
                                            )
                                          }
                                          className={`
                                            px-3
                                            py-2
                                            rounded-xl
                                            text-xs
                                            font-bold
                                            transition-all

                                            ${
                                              task.status ===
                                              status
                                                ? `
                                                  bg-violet-600
                                                  text-white
                                                `
                                                : `
                                                  bg-gray-100
                                                  hover:bg-violet-100
                                                `
                                            }
                                          `}
                                        >

                                          {

                                            status.replace(
                                              "_",
                                              " "
                                            )

                                          }

                                        </button>

                                      )
                                    )

                                  }

                                </div>

                              </div>

                            )
                          )

                      }

                    </div>

                  </div>

                )
              )

            }

          </div>

        )

      }

    </div>

  );

}