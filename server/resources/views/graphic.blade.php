{{--
    Daily reading card graphic.
    Expects these variables (e.g. the plan's dailyReadingsFor output):
    - $month      (string)  — today's Ethiopian month name in Amharic (ጥቅምት)
    - $day        (int)     — today's Ethiopian day of month (10)
    - $currentDay (int)     — e.g. 10
    - $totalDays  (int)     — e.g. 182
    - $readings   (array)   — each entry: ['book' => ..., 'chapter_number' => ...]
--}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Reading Card</title>
    <style>
        /* Nokia Pure Headline — the same Amharic headline cut used in the readers app.
           Inlined as base64 because the conversion API renders the HTML on its
           own servers and cannot follow relative asset paths. */
        @font-face {
            font-family: 'Nokia Pure Headline';
            src: url(data:font/truetype;base64,{!! base64_encode(file_get_contents(public_path('BibleStudyReaders/src/assets/nokia-pure-headline-bd.ttf'))) !!}) format('truetype');
            font-weight: 100 900;
            font-style: normal;
            font-display: swap;
        }

        /* Letter-sized output would otherwise depend on the converter's
           default page. */
        @page {
            size: 1080px 1350px;
            margin: 0;
        }

        *{
            margin: 0;
            padding: 0;
        }
        /* The card must come out exactly 1080x1350, so every size is a fixed
           pixel value — viewport units would depend on the converter's
           default page size. */
        html, body{
            width: 1080px;
            height: 1350px;
        }
        img{
            /* Over-tall on purpose: the converter's own default page can be
              taller than the card, and this keeps the artwork's bottom edge
              outside the 1080x1350 crop no matter how tall that page is. */
            width: 1080px;
            height: 2200px;
            object-fit: cover;
            object-position: left 50% top -150px;
        }
        body{
            overflow: hidden;
            font-family: 'Nokia Pure Headline', system-ui, sans-serif;
        }
        .shade{
            width: 1080px;
            height: 2200px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(255,255,255,0.85);
        }

        /* Text overlay that matches the daily card graphic. */
        .overlay{
            width: 1080px;
            height: 1350px;
            position: absolute;
            top: 0;
            left: 0;
            text-align: center;
        }

        .headline{
            margin-top: 162px;
            color: #1758a8;
            font-weight: 700;
            font-size: 75px;
            line-height: 1.35;
        }

        .day{
            margin-top: 203px;
            color: #e67617;
            font-weight: 700;
            font-size: 55px;
            line-height: 1.2;
        }

        .chapters{
            margin-top: 34px;
            list-style: none;
            color: #e67617;
            font-weight: 700;
            font-size: 55px;
            line-height: 86px;
        }
    </style>
</head>
<body>
    <main>
        <div class="shade"></div>
        <img src="data:image/jpeg;base64,{!! base64_encode(file_get_contents(public_path('bg_poster.jpg'))) !!}" alt="">
        <div class="overlay">
            <h1 class="headline">📖 የዛሬ {{ $month }} {{ $day }} ንባባችን </h1>
            <p class="day">Day {{ $currentDay }} of {{ $totalDays }} &middot;</p>
            <ul class="chapters">
                @foreach ($readings as $reading)
                    <li>📖 {{ $reading['book'] }} {{ $reading['chapter_number'] }}</li>
                @endforeach
            </ul>
        </div>
    </main>
</body>
</html>
