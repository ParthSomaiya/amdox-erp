import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import api from "../utils/axiosInstance";

export default function CalendarPage() {

  // ================= STATE =================

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [form, setForm] =
    useState({

      title: "",
      location: "",
      start: "",
      end: "",

    });

  // ================= FETCH EVENTS =================

  useEffect(() => {

    fetchEvents();

  }, []);

  const fetchEvents =
    async () => {

      try {

        setLoading(true);

        const res =
          await api.get(
            "/calendar"
          );

        setEvents(
          Array.isArray(res.data)
            ? res.data
            : []
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= HANDLE CHANGE =================

  const handleChange =
    (e) => {

      setForm({

        ...form,

        [e.target.name]:
          e.target.value,

      });

    };

  // ================= CREATE EVENT =================

  const createEvent =
    async (e) => {

      e.preventDefault();

      try {

        setCreating(true);

        await api.post(
          "/calendar",
          {

            title:
              form.title,

            location:
              form.location,

            start:
              form.start,

            end:
              form.end,

          }
        );

        setShowModal(false);

        setForm({

          title: "",
          location: "",
          start: "",
          end: "",

        });

        fetchEvents();

      } catch (err) {

        console.log(err);

        alert(
          "Failed to create event"
        );

      } finally {

        setCreating(false);

      }

    };

  // ================= DELETE EVENT =================

  const deleteEvent =
    async (id) => {

      try {

        await api.delete(
          `/calendar/${id}`
        );

        setEvents(
          (prev) =>
            prev.filter(
              (item) =>
                item._id !== id
            )
        );

      } catch (err) {

        console.log(err);

      }

    };

  // ================= FILTER EVENTS =================

  const filteredEvents =
    useMemo(() => {

      return events.filter(
        (item) => {

          const text = `
            ${item.title || ""}
            ${item.location || ""}
          `.toLowerCase();

          return text.includes(
            search.toLowerCase()
          );

        }
      );

    }, [events, search]);

  // ================= UPCOMING =================

  const upcomingEvents =
    filteredEvents.filter(
      (event) =>

        new Date(
          event.start
        ) >= new Date()
    );

  // ================= SORTED =================

  const sortedEvents =
    [...filteredEvents].sort(
      (a, b) =>

        new Date(a.start) -
        new Date(b.start)
    );

  return (

    <div className="space-y-8">

      {/* HERO */}

      <div
        className="
          bg-gradient-to-r
          from-violet-600
          via-indigo-600
          to-blue-600
          rounded-[32px]
          p-10
          text-white
          shadow-xl
        "
      >

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-8
          "
        >

          <div>

            <div
              className="
                flex
                items-center
                gap-5
              "
            >

              <div
                className="
                  h-20
                  w-20
                  rounded-3xl
                  bg-white/15
                  backdrop-blur-xl
                  flex
                  items-center
                  justify-center
                "
              >

                <CalendarDays
                  size={40}
                />

              </div>

              <div>

                <h1
                  className="
                    text-5xl
                    font-black
                  "
                >

                  Calendar Events

                </h1>

                <p
                  className="
                    mt-3
                    text-indigo-100
                    text-lg
                  "
                >

                  Manage schedules,
                  meetings and company
                  events professionally

                </p>

              </div>

            </div>

          </div>

          {/* STATS */}

          <div
            className="
              grid
              grid-cols-2
              gap-5
            "
          >

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                rounded-3xl
                p-6
                min-w-[170px]
              "
            >

              <p className="text-indigo-100">
                Total Events
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                "
              >

                {events.length}

              </h2>

            </div>

            <div
              className="
                bg-white/10
                backdrop-blur-xl
                rounded-3xl
                p-6
                min-w-[170px]
              "
            >

              <p className="text-indigo-100">
                Upcoming
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  mt-2
                "
              >

                {
                  upcomingEvents.length
                }

              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div
        className="
          bg-white
          rounded-[32px]
          shadow-lg
          p-6
          flex
          flex-col
          lg:flex-row
          gap-5
          lg:items-center
          lg:justify-between
        "
      >

        {/* SEARCH */}

        <div
          className="
            relative
            w-full
            lg:w-[400px]
          "
        >

          <Search
            size={20}
            className="
              absolute
              left-5
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              w-full
              h-14
              rounded-2xl
              border
              border-gray-300
              pl-14
              pr-5
              outline-none
              focus:border-indigo-500
            "
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            h-14
            px-8
            rounded-2xl
            bg-gradient-to-r
            from-indigo-600
            to-blue-600
            text-white
            font-bold
            flex
            items-center
            justify-center
            gap-3
            hover:scale-[1.02]
            transition-all
          "
        >

          <Plus size={20} />

          Create Event

        </button>

      </div>

      {/* EVENTS */}

      {loading ? (

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-lg
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

            Loading Events...

          </h2>

        </div>

      ) : sortedEvents.length ===
        0 ? (

        <div
          className="
            bg-white
            rounded-[32px]
            shadow-lg
            p-20
            text-center
          "
        >

          <CalendarDays
            size={80}
            className="
              mx-auto
              text-slate-300
            "
          />

          <h2
            className="
              text-4xl
              font-black
              mt-8
            "
          >

            No Events Found

          </h2>

          <p
            className="
              text-gray-500
              mt-4
              text-lg
            "
          >

            Create your first
            calendar event

          </p>

        </div>

      ) : (

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
          "
        >

          {sortedEvents.map(
            (event) => (

              <div
                key={event._id}
                className="
                  bg-white
                  rounded-[32px]
                  shadow-lg
                  p-8
                  hover:shadow-2xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                "
              >

                {/* TOP */}

                <div
                  className="
                    flex
                    justify-between
                    items-start
                    gap-5
                  "
                >

                  <div>

                    <h2
                      className="
                        text-2xl
                        font-black
                        leading-tight
                      "
                    >

                      {event.title}

                    </h2>

                    <p
                      className="
                        text-indigo-600
                        font-semibold
                        mt-3
                      "
                    >

                      Company Event

                    </p>

                  </div>

                  <div
                    className="
                      h-16
                      w-16
                      rounded-3xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-blue-600
                      flex
                      items-center
                      justify-center
                      text-white
                      shrink-0
                    "
                  >

                    <CalendarDays
                      size={30}
                    />

                  </div>

                </div>

                {/* INFO */}

                <div
                  className="
                    mt-8
                    space-y-5
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-gray-600
                    "
                  >

                    <Clock3
                      size={18}
                    />

                    <div>

                      <p className="font-semibold">
                        Start
                      </p>

                      <p>

                        {new Date(
                          event.start
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-gray-600
                    "
                  >

                    <Clock3
                      size={18}
                    />

                    <div>

                      <p className="font-semibold">
                        End
                      </p>

                      <p>

                        {new Date(
                          event.end
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>

                  {event.location && (

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        text-gray-600
                      "
                    >

                      <MapPin
                        size={18}
                      />

                      <span>

                        {
                          event.location
                        }

                      </span>

                    </div>

                  )}

                </div>

                {/* ACTIONS */}

                <div
                  className="
                    mt-8
                    flex
                    gap-4
                  "
                >

                  <button
                    className="
                      flex-1
                      h-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-600
                      to-blue-600
                      text-white
                      font-bold
                    "
                  >

                    View Details

                  </button>

                  <button
                    onClick={() =>
                      deleteEvent(
                        event._id
                      )
                    }
                    className="
                      h-12
                      w-12
                      rounded-2xl
                      bg-red-500
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <Trash2
                      size={18}
                    />

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* MODAL */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-5
          "
        >

          <div
            className="
              w-full
              max-w-2xl
              bg-white
              rounded-[32px]
              p-8
              shadow-2xl
            "
          >

            {/* HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                mb-8
              "
            >

              <div>

                <h2
                  className="
                    text-3xl
                    font-black
                  "
                >

                  Create Event

                </h2>

                <p className="text-gray-500 mt-2">

                  Add a new calendar
                  schedule

                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-slate-100
                  text-gray-600
                  font-bold
                  text-xl
                "
              >

                ×

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={createEvent}
              className="space-y-6"
            >

              {/* TITLE */}

              <div>

                <label
                  className="
                    block
                    font-semibold
                    mb-3
                  "
                >

                  Event Title

                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={
                    handleChange
                  }
                  required
                  placeholder="Board Meeting"
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    px-5
                    outline-none
                    focus:border-indigo-500
                  "
                />

              </div>

              {/* LOCATION */}

              <div>

                <label
                  className="
                    block
                    font-semibold
                    mb-3
                  "
                >

                  Location

                </label>

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={
                    handleChange
                  }
                  placeholder="Conference Room"
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    border
                    border-gray-300
                    px-5
                    outline-none
                    focus:border-indigo-500
                  "
                />

              </div>

              {/* DATES */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-6
                "
              >

                <div>

                  <label
                    className="
                      block
                      font-semibold
                      mb-3
                    "
                  >

                    Start Date

                  </label>

                  <input
                    type="datetime-local"
                    name="start"
                    value={form.start}
                    onChange={
                      handleChange
                    }
                    required
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-300
                      px-5
                      outline-none
                      focus:border-indigo-500
                    "
                  />

                </div>

                <div>

                  <label
                    className="
                      block
                      font-semibold
                      mb-3
                    "
                  >

                    End Date

                  </label>

                  <input
                    type="datetime-local"
                    name="end"
                    value={form.end}
                    onChange={
                      handleChange
                    }
                    required
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-300
                      px-5
                      outline-none
                      focus:border-indigo-500
                    "
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div
                className="
                  flex
                  gap-4
                  pt-4
                "
              >

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    flex-1
                    h-14
                    rounded-2xl
                    bg-slate-200
                    text-gray-700
                    font-bold
                  "
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="
                    flex-1
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-600
                    to-blue-600
                    text-white
                    font-bold
                    hover:scale-[1.02]
                    transition-all
                    disabled:opacity-50
                  "
                >

                  {creating
                    ? "Creating..."
                    : "Create Event"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}