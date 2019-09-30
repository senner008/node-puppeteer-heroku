interface food {
    title : string;
    description : string | string[];
    price : string | string[];
}

interface foodtype {
    title : string;
    content : food[];
}

interface foodsObject {
    foods : foodtype[];
}

export default async function extractList(page) {
    return await page.evaluate((data) : [foodsObject] => {

        const titles : NodeListOf<HTMLHeadingElement> = document.querySelectorAll(".menu-list__title");
        var obj : foodsObject = { foods: [] };
        Array.from(titles).forEach(title => {
            const food : food[] = Array.from(title.nextElementSibling.nextElementSibling.getElementsByTagName("li"))
                .map(li => {
                    const findtitle  = (sel1 : HTMLSpanElement, sel2 : HTMLHeadingElement ) : string => (sel1 || sel2).innerHTML;

                    var findElems = (sel: NodeListOf<HTMLParagraphElement | HTMLSpanElement>) : string[] | string => {
                        var xelem = Array.from(sel);
                        return xelem.length > 1 ? xelem.map(el => el.innerHTML) : xelem[0].innerHTML
                    }
  
                    return {
                        "title": findtitle(li.querySelector<HTMLSpanElement>(".item_title"), li.querySelector<HTMLHeadingElement>(".menu-list__item-title")),
                        "description": findElems(li.querySelectorAll<HTMLParagraphElement>(".desc__content")),
                        "price": findElems(li.querySelectorAll<HTMLSpanElement>(".menu-list__item-price"))
                    } as food
                });
            const hasObject : boolean = obj.foods.some(s => s.title == title.innerHTML);   
            obj.foods.push({ title: (hasObject ? 'Familie-' + title.innerHTML : title.innerHTML), content: food });
        });
        return [obj];
    })
};