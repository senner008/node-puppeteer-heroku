export default async function extractList(page) {
    return await page.evaluate((data) => {

        var titles = document.querySelectorAll(".menu-list__title");
        var obj = { foods: [] };
        Array.from(titles).forEach(title => {
            var lis = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                .map(li => {
                    var findtitle = li.querySelector(".item_title") || li.querySelector(".menu-list__item-title");
                    return {
                        "title": findtitle.innerHTML,
                        "description": li.querySelector(".desc__content").innerHTML,
                        "price": li.querySelector(".menu-list__item-price").innerHTML
                    }
                });
            obj.foods.push({ title: title.innerHTML, content: lis });
        });
        return [obj];
    })
};