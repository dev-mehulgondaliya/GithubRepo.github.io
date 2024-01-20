$(document).ready(async function(){let t="dev-mehulgondaliya",e=1,a,r="desc",i=$("#number_of_repo").text();async function n(t){$("#user_profile_img").addClass("skeleton-circle"),$("#user_name,#user_bio,#user_location,#twitter,#github").addClass("skeleton-loader");try{let e=await fetch(`https://api.github.com/users/${t}`);if(e.ok){let a=await e.json();console.log("Fetched data with Fetch API:",a),$("#user_profile_img").attr("src",`${a.avatar_url}`),$("#user_name").text(`${a.name}`),$("#user_bio").text(null!==a.bio&&"null"!==a.bio?a.bio:"No bio available"),(null!==a.location||"null"!==a.location)&&$("#user_location").html(`
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${a.location}</span>
                    `),(null!==a.html_url||"null"!==a.html_url)&&($("#user_github").text(`${a.html_url}`),$("#user_github_link").attr("href",`${a.html_url}`),$(".fa-github").show()),a.twitter_username&&null!==a.twitter_username&&"null"!==a.twitter_username&&($("#user_twitter").text(`https://twitter.com/${a.twitter_username}`),$("#twitter_link").attr("href",`https://twitter.com/${a.twitter_username}`),$(".fa-x-twitter").show()),$("#user_profile_img").removeClass("skeleton-circle"),$("#user_name,#user_bio,#user_location,#twitter,#github").removeClass("skeleton-loader")}else throw Error("Network response was not ok")}catch(r){console.error("Error fetching data with Fetch API:",r)}}async function o(t,e,a,r){$("#spinner_loader").show(),$("#repo_showcase").html(""),$("#filter,#pagination-container").hide();try{let i=await fetch(`https://api.github.com/users/${t}/repos?page=${a}&per_page=${e}&sort=created&direction=${r}`);if(i.ok){let n=await i.json();console.log("Fetched data with Fetch API:",n),n&&n.forEach(function(e){let a=new Date(e.updated_at),r=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:"UTC"}).format(a);$("#repo_showcase").append(`
                            <div class="col-12 p-1">
                                <div class="border border-1 rounded  p-2">
                                    <a href="https://github.com/${t}/${e.name}" target="_blank" class="text-primary reponame text-wrap text-break">${e.name}</a>
                                    <p class="d-flex gap-1 align-items-center text-secondary-emphasis">Update at ${r}</p>
                                    <p>${null!==e.description&&"null"!==e.description?e.description:""}</p>
                                    <div class="d-flex flex-wrap gap-2">
                                    ${e.topics.map(t=>`
                                        <button class="bg-info rounded-pill border-0 text-white p-2">${t}</button>
                                    `).join("")}
                                    </div>
                                </div>
                            </div>
                        `)}),$("#spinner_loader").hide(),$("#filter,#pagination-container").show()}else throw Error("Network response was not ok")}catch(o){console.error("Error fetching data with Fetch API:",o)}}async function l(){try{let n=await fetch(`https://api.github.com/users/${t}/repos`);if(n.ok){let u=await n.json();console.log("Fetched data with Fetch API:",u);let p=u.length;a=Math.ceil(p/Math.round(i)),console.log(a,Math.round(i)),function a(n){let u=$("#pagination-container");u.empty(),console.log(n);let p=Math.max(1,e-Math.floor(2.5)),d=Math.min(n,p+5-1);for(let h=p;h<=d;h++){let b=$("<button>",{type:"button",class:"btn btn-outline-dark",text:h,click:function(){e=h,o(t,i,h,r),l()}});h==e&&b.addClass("active"),1==n&&(b.addClass("active"),$("#prevbtn").prop("disabled",!0),$("#nextbtn").prop("disabled",!0)),u.append(b)}let f=$("<button>",{type:"button",id:"prevbtn",class:"btn btn-outline-dark","aria-label":"Previous Button",html:'<i class="fa-solid fa-angles-left"></i>',click:s});u.prepend(f),1==e&&$("#prevbtn").prop("disabled",!0);let m=$("<button>",{type:"button",id:"nextbtn",class:"btn btn-outline-dark","aria-label":"Next Button",html:'<i class="fa-solid fa-angles-right"></i>',click:c});u.append(m),e==n&&$("#nextbtn").prop("disabled",!0)}(a)}else throw Error("Network response was not ok")}catch(d){console.error("Error fetching data with Fetch API:",d)}}function s(){e>1?(e--,l(),o(t,i,e,r)):$("#prevbtn").prop("disabled",!0)}function c(){let n=a;e<n?(e++,l(),o(t,i,e,r)):$("#nextbtn").prop("disabled",!0)}$("#userSearchbtn").on("click",function(){n(t=$("#userSearch").val()),o(t,i,1,r),$("#userSearch").val("")}),n(t),o(t,i,1,r),$(".numberoflist a").on("click",function(a){a.preventDefault();var n=$(this).data("value");$("#number_of_repo").text(n),i=$("#number_of_repo").text(),o(t,n,e=1,r),l()}),$(".sorting a").on("click",function(a){a.preventDefault();var r=$(this).text(),n=$(this).data("value");$("#sortingvalue").text(r),o(t,i,e=1,n),l()}),l()});