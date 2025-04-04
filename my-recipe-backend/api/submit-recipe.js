const axios = require('axios');

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const { name, description, images } = req.body;
        const githubToken = process.env.RECIPE_SUBMISSION_TOKEN; 
        const repoOwner = 'varnereh';
        const repoName = 'BirthdayGift';
        
        const issueTitle = `New Recipe: ${name}`;
        const issueBody = `**Recipe Name:** ${name}\n\n**Ingredients & Instructions:**\n${description}\n\n**Images:**\n${images.join("\n")}`;

        try {
            const response = await axios.post(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
                title: issueTitle,
                body: issueBody,
                labels: ['recipe-submission']
            }, {
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 201) {
                res.status(200).send('Recipe submitted successfully!');
            } else {
                res.status(400).send('Failed to submit recipe');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error submitting recipe');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
