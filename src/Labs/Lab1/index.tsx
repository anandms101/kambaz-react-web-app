export default function Lab1() {
    return (
        <div id="wd-lab1">
            <h2>Lab 1</h2>
            <h3>HTML Examples</h3>
            <div id="wd-h-tag">
                <h4>Heading Tags</h4>
                Text documents are often broken up into several sections and subsections. Each section is usually prefaced with a short title or heading that attempts to summarize the topic of the section it precedes. For instance this paragraph is preceded by the heading Heading Tags. The font of the section headings are usually larger and bolder than their subsection headings. This document uses headings to introduce topics such as HTML Documents, HTML Tags, Heading Tags, etc. HTML heading tags can be used to format plain text so that it renders in a browser as large headings. There are 6 heading tags for different sizes: h1, h2, h3, h4, h5, and h6. Tag h1 is the largest heading and h6 is the smallest heading.
            </div>
            <div id="wd-p-tag">
                <h4>Paragraph Tag</h4>
                <p id="wd-p-1">
                    This is a paragraph. We often separate a long set of sentences with vertical spaces to make the text easier to read. Browsers ignore vertical white spaces and render all the text as one single set of sentences. To force the browser to add vertical spacing, wrap the paragraphs you want to separate with the paragraph tag
                </p>
                <p id="wd-p-2">
                    This is the first paragraph. The paragraph tag is used to format vertical gaps between long pieces of text like this one.
                </p>
                <p id="wd-p-3">
                    This is the second paragraph. Even though there is a deliberate white gap between the paragraph above and this paragraph, by default browsers render them as one contiguous piece of text as shown here on the right.
                </p>
                <p id="wd-p-4">
                    This is the third paragraph. Wrap each paragraph with the paragraph tag to tell browsers to render the gaps.
                </p>
            </div>
            <div id="wd-lists">
                <h4>List Tags</h4>
                <h5>Ordered List Tag</h5>
                How to make pancakes:
                <ol id="wd-pancakes">
                    <li>Mix dry ingredients.</li>
                    <li>Add wet ingredients.</li>
                    <li>Stir to combine.</li>
                    <li>Heat a skillet or griddle.</li>
                    <li>Pour batter onto the skillet.</li>
                    <li>Cook until bubbly on top.</li>
                    <li>Flip and cook the other side.</li>
                    <li>Serve and enjoy!</li>
                </ol>
                My favorite recipe: Paneer Curry:
                <ol id="wd-your-favorite-recipe">
                    <li>Heat oil in a large pan over medium heat.</li>
                    <li>Add cumin seeds and let them sizzle.</li>
                    <li>Add chopped onions and sauté until golden brown.</li>
                    <li>Add ginger-garlic paste and cook for 2 minutes.</li>
                    <li>Add chopped tomatoes and cook until soft.</li>
                    <li>Add turmeric, red chili powder, and garam masala.</li>
                    <li>Add paneer cubes and simmer for 5 minutes.</li>
                    <li>Garnish with fresh cilantro and serve with naan!</li>
                </ol>
                <h5>Unordered List Tag</h5>
                My favorite books (in no particular order)
                <ul id="wd-my-books">
                    <li>Dune</li>
                    <li>Lord of the Rings</li>
                    <li>Ender's Game</li>
                    <li>Red Mars</li>
                    <li>The Forever War</li>
                </ul>
                Your favorite books (in no particular order)
                <ul id="wd-your-books">
                    <li>The Invisible Life of Addie LaRue</li>
                    <li>Rebecca</li>
                    <li>Mexican Gothic</li>
                    <li>The Seven Husbands of Evelyn Hugo</li>
                    <li>A Court of Thorns and Roses</li>
                </ul>
            </div>
            <div id="wd-tables">
                <h4>Table Tag</h4>
                <table border={1} width="100%">
                    <thead>
                        <tr>
                            <th align="center">Quiz</th>
                            <th align="center">Topic</th>
                            <th align="center">Date</th>
                            <th align="center">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td valign="middle" align="center">Q1</td>
                            <td valign="middle" align="center">HTML</td>
                            <td valign="middle" align="center">2/3/21</td>
                            <td valign="middle" align="center">85</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q2</td>
                            <td valign="middle" align="center">CSS</td>
                            <td valign="middle" align="center">2/10/21</td>
                            <td valign="middle" align="center">90</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q3</td>
                            <td valign="middle" align="center">JavaScript</td>
                            <td valign="middle" align="center">2/17/21</td>
                            <td valign="middle" align="center">88</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q4</td>
                            <td valign="middle" align="center">React</td>
                            <td valign="middle" align="center">2/24/21</td>
                            <td valign="middle" align="center">92</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q5</td>
                            <td valign="middle" align="center">Node.js</td>
                            <td valign="middle" align="center">3/3/21</td>
                            <td valign="middle" align="center">87</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q6</td>
                            <td valign="middle" align="center">Express</td>
                            <td valign="middle" align="center">3/10/21</td>
                            <td valign="middle" align="center">91</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q7</td>
                            <td valign="middle" align="center">MongoDB</td>
                            <td valign="middle" align="center">3/17/21</td>
                            <td valign="middle" align="center">89</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q8</td>
                            <td valign="middle" align="center">APIs</td>
                            <td valign="middle" align="center">3/24/21</td>
                            <td valign="middle" align="center">93</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q9</td>
                            <td valign="middle" align="center">Authentication</td>
                            <td valign="middle" align="center">3/31/21</td>
                            <td valign="middle" align="center">86</td>
                        </tr>
                        <tr>
                            <td valign="middle" align="center">Q10</td>
                            <td valign="middle" align="center">Deployment</td>
                            <td valign="middle" align="center">4/7/21</td>
                            <td valign="middle" align="center">94</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td valign="middle" align="center" colSpan={3}>Average</td>
                            <td valign="middle" align="center">90</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div id="wd-images">
                <h4>Image tag</h4>
                Loading an image from the internet: <br />
                <img id="wd-starship" width="400px" src="https://www.staradvertiser.com/wp-content/uploads/2021/08/web1_Starship-gap2.jpg" />
                <br />
                Loading a local image:
                <br />
                <img id="wd-teslabot" src="/images/teslabot.jpg" height="200px" />
            </div>
        </div>
    )
}