const data = require('../assets/data/structured-data.json'); // Adjust path to your projects data
const projects = data.projects;

export const createImagePaths = () => {
    let imagePaths = {};
    projects.forEach(project => {
        const projectName = project.CCODE;
        const projectNameRestructured = projectName.replace(/\s/g, "_");
        const imageString = `require('../assets/images/visualizationsProjects/${projectNameRestructured}.png)`;

        imagePaths.push({ projectName: imageString });
    });

    return imagePaths
}
