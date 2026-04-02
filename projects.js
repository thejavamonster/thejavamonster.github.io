const projects = [
  {
    title: "Smiggles",
    description:
      "A lightweight OS (in progress).",
    url: "/",
    githubUrl: "https://github.com/TheExpert24/smiggles",
    images: [
      "images/smiggles.png"
    ]
  },
  {
    title: "Google Trends Map",
    description:
      "A live-updating map showing top Google searches across the USA.",
    url: "https://thejavamonster.github.io/trendmap",
    githubUrl: "https://github.com/thejavamonster/trendmap",
    images: [
      "images/trendmap.png"
    ]
  },
  {
    title: "Websudoku",
    description:
      "An online sudoku game with difficulty levels and multiplayer support.",
    url: "https://websudoku.me",
    githubUrl: "https://github.com/thejavamonster/websudoku",
    images: [
      "images/websudoku.png"
    ]
  },
  {
    title: "Live Globe",
    description:
      "A 3D globe with live day/night shading, real-time weather data, and local news.",
    url: "https://thejavsamonster.github.io/globe",
    githubUrl: "https://github.com/thejavamonster/globe",
    images: [
      "images/globe.png"
    ]
  },
  {
    title: "Presidential Footrace",
    description:
      "The stupidest thing I've ever made, but a very well-researched stupid thing.",
    url: "https://thejavamonster.github.io/presidentspeed",
    githubUrl: "https://github.com/thejavamonster/presidentspeed",
    images: [
      "images/presidentspeed.png"
    ]
  },
    {
    title: "Bill",
    description:
      "Analyzes S&P 500 stocks and gives recommendations.",
    url: "https://bill-bsaf.onrender.com",
    githubUrl: "https://github.com/TheExpert24/bill",
    images: [
      "images/bill.png"
    ]
  },
  {
    title: "Pronto Mod Bot",
    description:
      "A Python mod bot for the Pronto platform. We won a hackathon with this.",
    url: "/",
    githubUrl: "https://github.com/thejavamonster/prontomod",
    images: [
      "images/prontomod.png"
    ]
  }
  
];

const listEl = document.getElementById("projects-list");
const templateEl = document.getElementById("project-template");

function normalizeImageSrc(rawSrc) {
  if (typeof rawSrc !== "string") {
    return "";
  }

  const trimmedSrc = rawSrc.trim();

  if (!trimmedSrc) {
    return "";
  }

  // Allow Windows-style local paths in data and convert them to web-safe slashes.
  return encodeURI(trimmedSrc.replace(/\\/g, "/"));
}

function getImageData(imageEntry, fallbackTitle, index) {
  if (typeof imageEntry === "string") {
    return {
      src: normalizeImageSrc(imageEntry),
      alt: `${fallbackTitle} screenshot ${index + 1}`
    };
  }

  if (imageEntry && typeof imageEntry === "object") {
    return {
      src: normalizeImageSrc(imageEntry.src),
      alt: imageEntry.alt || `${fallbackTitle} screenshot ${index + 1}`
    };
  }

  return { src: "", alt: `${fallbackTitle} screenshot ${index + 1}` };
}

function renderProjects(items) {
  if (!Array.isArray(items) || items.length === 0) {
    listEl.innerHTML = "<p>No projects yet. Add one in projects.js.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((project) => {
    const clone = templateEl.content.cloneNode(true);

    const titleEl = clone.querySelector(".project-title");
    const descriptionEl = clone.querySelector(".project-description");
    const linkEl = clone.querySelector(".project-link");
    const githubLinkEl = clone.querySelector(".project-github-link");
    const githubSepEl = clone.querySelector(".github-sep");
    const imagesEl = clone.querySelector(".project-images");

    titleEl.textContent = project.title || "Untitled Project";
    descriptionEl.textContent = project.description || "No description provided.";

    linkEl.textContent = "Visit project";
    linkEl.href = project.url || "#";

    if (project.githubUrl) {
      githubLinkEl.href = project.githubUrl;
    } else {
      githubLinkEl.remove();
      githubSepEl.remove();
    }

    if (Array.isArray(project.images) && project.images.length > 0) {
      project.images.forEach((imageEntry, index) => {
        const imageData = getImageData(
          imageEntry,
          project.title || "Project",
          index
        );

        if (!imageData.src) {
          return;
        }

        const img = document.createElement("img");
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.loading = "lazy";
        imagesEl.appendChild(img);
      });

      if (imagesEl.childElementCount === 0) {
        const emptyNote = document.createElement("p");
        emptyNote.className = "no-images";
        emptyNote.textContent = "No valid image path provided.";
        imagesEl.appendChild(emptyNote);
      }
    } else {
      const emptyNote = document.createElement("p");
      emptyNote.className = "no-images";
      emptyNote.textContent = "No image provided.";
      imagesEl.appendChild(emptyNote);
    }

    fragment.appendChild(clone);
  });

  listEl.innerHTML = "";
  listEl.appendChild(fragment);
}

renderProjects(projects);
