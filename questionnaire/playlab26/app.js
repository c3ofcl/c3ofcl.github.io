/*
 c3 playlab 26 questionnaire app
 6 questions and guide for 7 booths
*/

const AXES = {
    action: {
        id: 'action',
        label: '体感・アクション',
        title: '体感・アクションタイプ',
        description:
            '直感的な操作や、体を動かして画面とダイナミックに連動する体験を楽しみたいタイプです。コントローラーやカメラを使って実際に手や体を動かし、自分のアクションで何が起こるかを試しながらブースを巡ってみましょう。'
    },
    create: {
        id: 'create',
        label: 'クリエイティブ',
        title: 'クリエイティブタイプ',
        description:
            '自分のアイデアを形にしたり、オリジナルの表現を生み出すことに魅力を感じるタイプです。ポストカード制作や動画編集、音楽制作など、その場で何かを作って楽しめる企画に注目すると充実した時間を過ごせます。'
    },
    ai: {
        id: 'ai',
        label: 'AI・コミュニケーション',
        title: 'AI・コミュニケーションタイプ',
        description:
            'AIとの対話や3Dキャラクターの生き生きとしたリアクション、人と人を繋ぐテクノロジーに関心がありそうです。音声でのやりとりやAIによる生成機能、街の魅力を伝えるマップアプリなどを体験してみると楽しいでしょう。'
    },
    tech: {
        id: 'tech',
        label: '制作のウラ側',
        title: '制作のウラ側タイプ',
        description:
            '作品そのものだけでなく、開発・制作に使われているツールや仕組み、プロセスに興味が湧くタイプです。各展示内で紹介される制作の方法や経験の話、1年生が未経験から成長してきた開発エピソードなどに注目してみてください。'
    }
};

/*
 6 questions with 4 options each
*/
const QUESTIONS = [
    {
        id: 1,
        question: 'Q1. 大学祭で教室に入ったとき、いくつかのブースが目に留まった。まず最初に試してみるとしたらどれを選びますか？',
        options: [
            {
                key: 'A',
                text: 'コントローラーを握ったり体を動かしたりして、直感的に遊べるゲームやアート',
                scores: { action: 3, create: 1, ai: 0, tech: 0 },
                boothBoost: ['duck-rooms', 'clunky-tanky']
            },
            {
                key: 'B',
                text: '絵入りポストカードや音楽、動画など、自分だけの作品を作れる創作コーナー',
                scores: { action: 0, create: 3, ai: 1, tech: 0 },
                boothBoost: ['ai-postcard', 'music-collab', 'ai-video-editor']
            },
            {
                key: 'C',
                text: '3Dキャラクターと声でおしゃべりしたり、AIの受け答えを楽しめる対話コーナー',
                scores: { action: 1, create: 0, ai: 3, tech: 0 },
                boothBoost: ['misaki-krie', 'ai-postcard']
            },
            {
                key: 'D',
                text: '学生がどんなツールやプログラミングで作ったのか、制作の裏側がわかる展示',
                scores: { action: 0, create: 0, ai: 1, tech: 3 },
                boothBoost: ['web-showcase', 'clunky-tanky', 'music-collab']
            }
        ]
    },
    {
        id: 2,
        question: 'Q2. コンピュータやデジタル作品に触れるとき、特にワクワクする瞬間は、次の中ならどれですか？',
        options: [
            {
                key: 'A',
                text: '自分の体の動きに合わせて、3D空間やオブジェクトがリアルタイムに反応するとき',
                scores: { action: 3, create: 0, ai: 0, tech: 1 },
                boothBoost: ['duck-rooms', 'clunky-tanky']
            },
            {
                key: 'B',
                text: '選択肢を選んだり音を並べたりして、オリジナルの作品がその場で仕上がるとき',
                scores: { action: 0, create: 3, ai: 0, tech: 1 },
                boothBoost: ['ai-postcard', 'ai-video-editor', 'music-collab']
            },
            {
                key: 'C',
                text: 'AIがこちらの声に答えてくれたり、キャラクターがお茶目なリアクションを返してくれるとき',
                scores: { action: 0, create: 1, ai: 3, tech: 0 },
                boothBoost: ['misaki-krie', 'ai-video-editor']
            },
            {
                key: 'D',
                text: '複雑に見える仕組みを、独自のプログラムや工夫されたUIで実現しているのを知ったとき',
                scores: { action: 0, create: 1, ai: 0, tech: 3 },
                boothBoost: ['web-showcase', 'ai-video-editor', 'music-collab']
            }
        ]
    },
    {
        id: 3,
        question: 'Q3. ゲームやWebアプリを体験するとき、もっとも惹かれる要素はどれでしょうか？',
        options: [
            {
                key: 'A',
                text: '動きの爽快感や、手に汗握る駆け引きなどアクションの面白さ',
                scores: { action: 3, create: 0, ai: 0, tech: 1 },
                boothBoost: ['clunky-tanky', 'duck-rooms']
            },
            {
                key: 'B',
                text: '初心者でも直感的に操作できて、自由自在に使うことができる使いやすさ',
                scores: { action: 1, create: 3, ai: 0, tech: 0 },
                boothBoost: ['music-collab', 'ai-video-editor', 'ai-postcard']
            },
            {
                key: 'C',
                text: 'あたかも感情があるかのような振る舞いや、そのソフトのデザイン・世界観',
                scores: { action: 0, create: 1, ai: 3, tech: 0 },
                boothBoost: ['misaki-krie', 'web-showcase', 'duck-rooms']
            },
            {
                key: 'D',
                text: 'どういうふうに動いているのかというしくみの斬新さや、通信・接続の方法',
                scores: { action: 0, create: 0, ai: 1, tech: 3 },
                boothBoost: ['clunky-tanky', 'music-collab', 'web-showcase']
            }
        ]
    },
    {
        id: 4,
        question: 'Q4. もしあなたが以下の4つのプロジェクトで制作に携わるなら、どんなプロジェクトに一番興味がありますか？',
        options: [
            {
                key: 'A',
                text: 'コントローラやカメラ認識を使った体感型ゲームや、こちらの行動に反応してきれいに動くような作品づくり',
                scores: { action: 3, create: 1, ai: 0, tech: 0 },
                boothBoost: ['duck-rooms', 'clunky-tanky']
            },
            {
                key: 'B',
                text: '画像生成AIやネットワーク系の機能を備えた、楽しいクリエイティブツールの開発',
                scores: { action: 0, create: 3, ai: 1, tech: 0 },
                boothBoost: ['music-collab', 'ai-video-editor', 'ai-postcard']
            },
            {
                key: 'C',
                text: '音声会話やデジタルマップなど、強い個性と独自の機能を持った作品の制作',
                scores: { action: 0, create: 1, ai: 3, tech: 0 },
                boothBoost: ['misaki-krie', 'web-showcase']
            },
            {
                key: 'D',
                text: '身近なWebサイトをゼロから作ったり、制作技術を身につけるチャンスがある企画',
                scores: { action: 0, create: 0, ai: 0, tech: 3 },
                boothBoost: ['web-showcase', 'music-collab', 'clunky-tanky']
            }
        ]
    },
    {
        id: 5,
        question: 'Q5. 今日の702教室の展示巡りで、一番思い出になりそうなものは何ですか？',
        options: [
            {
                key: 'A',
                text: '手や体を動かして、身体を全力で動かして遊んだ爽快感',
                scores: { action: 3, create: 0, ai: 1, tech: 0 },
                boothBoost: ['duck-rooms', 'clunky-tanky']
            },
            {
                key: 'B',
                text: '実際にお持ち帰りできるオリジナルポストカードや、音楽・動画の制作体験',
                scores: { action: 0, create: 3, ai: 0, tech: 0 },
                boothBoost: ['ai-postcard', 'music-collab', 'ai-video-editor']
            },
            {
                key: 'C',
                text: 'AIキャラクターとの楽しいチャットや、市ヶ谷の街・学祭の新しい魅力の発見',
                scores: { action: 0, create: 1, ai: 3, tech: 0 },
                boothBoost: ['misaki-krie', 'web-showcase', 'ai-postcard']
            },
            {
                key: 'D',
                text: 'プログラミング未経験から制作できるようになるまでの学びや、制作のヒント',
                scores: { action: 0, create: 1, ai: 0, tech: 3 },
                boothBoost: ['clunky-tanky', 'web-showcase', 'duck-rooms']
            }
        ]
    },
    {
        id: 6,
        question: 'Q6. あなたは中央大学 国際情報学部（iTL）の学生ですか？',
        options: [
            {
                key: 'A',
                text: 'はい、iTLの学生です',
                isItl: true,
                scores: { action: 0, create: 0, ai: 0, tech: 0 }
            },
            {
                key: 'B',
                text: 'いいえ、中央大学の他学部生です',
                isItl: false,
                scores: { action: 0, create: 0, ai: 0, tech: 0 }
            },
            {
                key: 'C',
                text: 'いいえ、高校生・受験生です',
                isItl: false,
                scores: { action: 0, create: 0, ai: 0, tech: 0 }
            },
            {
                key: 'D',
                text: 'いいえ、一般・卒業生・学外の方です',
                isItl: false,
                scores: { action: 0, create: 0, ai: 0, tech: 0 }
            }
        ]
    }
];

/*
 7 exhibition booths data
*/
const BOOTHS = [
    {
        id: 'duck-rooms',
        order: 1,
        title: 'アヒルルームズ（Touchdesignerデモ）',
        category: 'インタラクティブ作品 / 体感アート',
        overview:
            'カメラで体の動作を読み取る技術と、コードを使わないビジュアルプログラミングツール「Touchdesigner」を使ったインタラクティブ作品です。手や体を動かすことで3D空間にあるオブジェクトを動かし、さまざまなアクションを体験できます。',
        affinityAxes: { action: 3, create: 2, ai: 1, tech: 2 },
        viewpoints: {
            action: {
                howToView:
                    'カメラの前に立って、手を振ったり体を大きく動かしたりしてみてください。自分の動作に合わせて3D空間のオブジェクトがどう反応するか、全身を使った体感アクションを楽しめます。',
                actionTip: '小さな動きとダイナミックな動きを使い分けて、反応の変化を確かめてみましょう。'
            },
            create: {
                howToView:
                    'ビジュアルプログラミングによる空間演出や、身体の動きがどのような視覚効果に変換されているかに着目してみましょう。コードを書かずに作る双方向的な作品の表現手法として参考になります。',
                actionTip: 'どんな動きをすると空間全体が映えるか、演出家のような視点で見て試してみてください。'
            },
            ai: {
                howToView:
                    'カメラが人間の骨格や動きを読み取り、画面内の世界と繋がる要素に注目してみましょう。言葉じゃない身体コミュニケーションの面白さを実感できます。',
                actionTip: '認識カメラが自分のどの部分を追従しているのか意識しながら動いてみましょう。'
            },
            tech: {
                howToView:
                    'Touchdesignerというソフトを活用して、カメラの映像入力から3Dオブジェクトをリアルタイムに動かすまでを、どのように組み上げているかが見どころです。',
                actionTip: 'どのようにこの作品を作ったのか、担当メンバーに直接質問してみましょう。'
            }
        }
    },
    {
        id: 'misaki-krie',
        order: 2,
        title: '三咲クリエのボイスチャット（AIチャットボットと話そう！）',
        category: '3Dアバター / AI音声会話',
        overview:
            'VRoidの「三咲クリエ」と、音声で会話が楽しめる企画です。表情やポージングも交えて元気に受け答えしてくれます。日常会話のスムーズさに加え、簡単なネット検索で調べて答えてくれる一方、時々うっかり間違えてしまうお茶目な一面もあります。',
        affinityAxes: { action: 1, create: 1, ai: 3, tech: 2 },
        viewpoints: {
            action: {
                howToView:
                    'マイクに向かってテンポよく話しかけてみてください。こちらの呼びかけに合わせて、表情やポーズがリアルタイムに切り替わる生き生きとしたリアクションを体験できます。',
                actionTip: '元気よく挨拶したり、大きめのリアクションが返ってきそうな話題を投げかけてみましょう。'
            },
            create: {
                howToView:
                    'VRoidで制作された3Dキャラクターデザインや、会話内容と連動する多彩なポーズに注目してみましょう。キャラクターの魅力を引き出す表現の工夫が詰まっています。',
                actionTip: '感情豊かなポーズや表情の変化に注目してみてください。細かな演出を楽しめます。'
            },
            ai: {
                howToView:
                    'まさにあなたにぴったりの企画です。自然な日常会話だけでなく、少し調べものが必要な質問を投げかけて、ネット検索を行いながら一生懸命答えてくれる様子を引き出してみてください。',
                actionTip: '雑談に加えて学祭関連のことなど色々な日常の話題を質問して、会話と検索機能の両方を試してみましょう。'
            },
            tech: {
                howToView:
                    '音声認識からAIによる返事の生成、Web検索との連携、音声合成、そして3Dモデルを動かすのに至るまで、しくみ全体が見どころです。',
                actionTip: '応答速度や感情判定がどのようにモーションに反映されているか、システム構成に注目してみましょう。'
            }
        }
    },
    {
        id: 'clunky-tanky',
        order: 3,
        title: 'CLUNKY TANKY（Joy-Conで遊べる戦車ゲーム）',
        category: '3Dゲーム / Unity & Joy-Con開発解説',
        overview:
            'Unityを使って開発された、Nintendo SwitchのJoy-Conで操作できる3D戦車シューターです。右手を動かすと視界と照準が連動し、体感で戦車を操縦できます。走攻守どの戦術でも楽しめる自由度の高さと安定したゲームプレイが特徴で、制作の仕組みについても別途紹介します。',
        affinityAxes: { action: 3, create: 1, ai: 0, tech: 3 },
        viewpoints: {
            action: {
                howToView:
                    '右手のJoy-Conを動かして直感的に照準を合わせる爽快な体感操作を味わってください。スピード重視で駆け回るか、守りを固めて確実に狙い撃つか、自分好みの戦術でミッションクリアを目指せます。',
                actionTip: '右手の傾きで照準を合わせる感覚をつかみ、高スコアを狙ってチャレンジしてみましょう。'
            },
            create: {
                howToView:
                    '体感操作を心地よいゲーム体験に落とし込むためのUIやミッション設計、戦車の重厚感の演出に注目してみましょう。プレイヤーを楽しませるゲームデザインの工夫が随所に散りばめられています。',
                actionTip: '試遊を楽しみながら仕組みに着目すると、ゲームづくりのアイデアがより深く理解できます。'
            },
            ai: {
                howToView:
                    'ステージ内の敵戦車の動きやバリエーション豊かなミッション構成を観察しながらプレイしてみましょう。Joy-Conの直感操作によって、まるで自分が戦車に乗り込んでいるような没入感が味わえます。',
                actionTip: '遮蔽物をうまく活用した立ち回りなど、戦術を変えながら敵との駆け引きを楽しんでみてください。'
            },
            tech: {
                howToView:
                    'ゲーム試遊に加えてゲームの作り方という視点が必見です。Unity上でJoy-Conの入力をどのように処理しているのか、3Dゲームを安定して動かすためのアーキテクチャを学べます。',
                actionTip: '気になった実装や設計のポイントは、開発に関係しているメンバーがお答えできます！'
            }
        }
    },
    {
        id: 'ai-postcard',
        order: 4,
        title: 'AIポストカード制作体験',
        category: '生成AI体験 / オリジナルグッズ制作',
        overview:
            'AIを使って世界で一枚だけのオリジナル絵入りポストカードが作れる体験コーナーです。複数の選択肢から好みの絵柄を選んで操作でき、完成したポストカードはそのまま記念に持ち帰ることができます。',
        affinityAxes: { action: 1, create: 3, ai: 3, tech: 1 },
        viewpoints: {
            action: {
                howToView:
                    '画面上で選択肢を直感的に選び、自分だけのポストカードがその場で仕上がっていくスピード感を体験してください。展示ブースを訪れた記念品として持ち帰ることができます。',
                actionTip: '直感で気になった選択肢を選んで、どんな絵柄が出来上がるかを楽しんでみましょう。'
            },
            create: {
                howToView:
                    '好みの組み合わせを選んで世界に一枚だけのビジュアルを作り上げる創作体験です。AIが描き出す絵柄のバリエーションや構図の魅力を感じながら、自分らしい1枚をプロデュースしてみてください。',
                actionTip: '色合いやモチーフのバランスを意識して、お気に入りの仕上がりを目指してみましょう。'
            },
            ai: {
                howToView:
                    '選択したキーワードや方向性に応じて、生成AIがどのようなディテールやタッチの絵を描き分けるのかに注目してみましょう。画像生成AIの表現力を間近で体感できます。',
                actionTip: '画像の生成を試す中で、AIの表現の幅広さを楽しんでみるといいでしょう。'
            },
            tech: {
                howToView:
                    '初心者でも迷わずポストカードを生成・印刷できるよう、どのようにユーザーに見える画面を作っているか、アプリ全体のしくみや見せ方のデザインが見どころです。',
                actionTip: '安定した品質の画像の生成、および使いやすくすための工夫が、裏側でどのように行われているのか注目してみましょう。'
            }
        }
    },
    {
        id: 'ai-video-editor',
        order: 5,
        title: 'AI搭載動画編集アプリ',
        category: 'クリエイティブWebアプリ / 生成AI統合',
        overview:
            'AIを使って動画編集ができる独自のWebアプリです。アプリ内で動画や画像を生成して素材として活用できる機能が統合されており、カット編集やテロップ入れなど必要な機能がシンプルにまとまっています。',
        affinityAxes: { action: 1, create: 3, ai: 2, tech: 2 },
        viewpoints: {
            action: {
                howToView:
                    '軽快かつお手軽に動画のカットやテロップ挿入ができる操作感を試してみてください。専用ソフトを入れなくてもサクサク動く心地よさを体験できます。',
                actionTip: '実際にタイムラインを操作して、編集やプレビューがどれくらい直感的に動くか触ってみましょう。'
            },
            create: {
                howToView:
                    '素材が足りなければその場でAI生成してタイムラインに組み込めるしくみが魅力です。多機能になりすぎず、カット編集とテロップ入れに集中できる使いやすさを味わえます。',
                actionTip: '素材のAI生成からテロップ配置まで、ちょっとした動画制作の一連の流れを試してみるのがおすすめです。'
            },
            ai: {
                howToView:
                    '単体のAIツールではなく、編集アプリの中に生成機能が自然に溶け込んでいる便利さに注目してみましょう。AIがクリエイターの作業をどのように後押ししてくれるのか、一歩先の制作環境を体感できます。',
                actionTip: 'アプリ内で生成できる画像や動画のバリエーションを実際に試してみてください。'
            },
            tech: {
                howToView:
                    'Webブラウザ上で動画編集のタイムライン処理、テロップ入れ、生成AIサービスとの連携までを1つのアプリに統合した、技術面の独自性や新しさに注目です。',
                actionTip: '動画のプレビュー処理や動画や画像の描写部分について、作りこまれたポイントを観察してみましょう。'
            }
        }
    },
    {
        id: 'music-collab',
        order: 6,
        title: '音楽共同製作アプリ',
        category: 'リアルタイム通信Webアプリ / 音楽制作',
        overview:
            'メンバーが独自開発した、複数人でリアルタイムに音楽を共同編集できるWebアプリです。1人がアプリを立ち上げればダウンロード不要で気軽に参加でき、音楽初心者にも優しい直感的な操作性と手軽さが特徴です。',
        affinityAxes: { action: 2, create: 3, ai: 0, tech: 3 },
        viewpoints: {
            action: {
                howToView:
                    '楽器の演奏経験がなくても画面を動かすことで、音楽作りに変化が生まれていく面白い感覚を簡単に楽しむことができます。',
                actionTip: '友人や部員と一緒に音を重ねて、その場で音楽が組み上がっていくライブ感を体験してみましょう。'
            },
            create: {
                howToView:
                    '音楽理論を知らなくても直感的に心地よいフレーズを作れるデザインが魅力です。1人で作るだけでなく、複数人で同じ画面を見ながらアイデアを重ねていく新しい楽しさを味わえます。',
                actionTip: '自由に使ってみて、自分だけのリズムパターンやメロディを作ってみましょう。'
            },
            ai: {
                howToView:
                    '複雑なソフトのダウンロードなしに、その場にいる人と音楽を通じてコミュニケーションができる手軽さに注目してみましょう。誰かの置いた音に応えるように自分の音を重ねる面白さがあります。',
                actionTip: '複数端末で同時に操作したときのリアルタイムな音楽制作を体験してみてください。'
            },
            tech: {
                howToView:
                    'ブラウザ環境だけで音源を再生したり、複数端末間のリアルタイム同期通信したり、色々なしくみを組み合わせて独自開発で実現している点に見どころが詰まった作品です。',
                actionTip: '同期編集できるしくみや制作にあたって大変だったところなどについて、担当に聞いてみましょう。'
            }
        }
    },
    {
        id: 'web-showcase',
        order: 7,
        title: 'Webアプリケーション紹介展示',
        category: 'Webサイト制作 / 共同開発プロジェクト展示',
        overview:
            'メンバー制作のWebサイトやWebアプリを展示。C3公式サイトや、市ヶ谷周辺を写し出すデジタル地図「Ichigaya Town Lens」に、実行委員会と共同開発した学祭企画検索サイト「フェスぽ」などを紹介しています。プログラミング未経験の1年生も開発の中心を担った点に注目です。',
        affinityAxes: { action: 0, create: 2, ai: 1, tech: 3 },
        viewpoints: {
            action: {
                howToView:
                    '展示端末やお手持ちのスマートフォンで、実際のWebサイトやマップを触ってみてください。Ichigaya Town Lensの直感的なマップ操作や「フェスぽ」でのスムーズな企画検索など、使い心地のよさを直接体験できます。',
                actionTip: 'Ichigaya Town Lensで気になる市ヶ谷のスポットを探したり、「フェスぽ」で大学祭の企画を検索してみましょう。'
            },
            create: {
                howToView:
                    '公式サイト、街のデジタルマップ、学祭企画検索サイトと、それぞれの目的に合わせたデザインや情報整理の工夫を見比べてみてください。メンバーが制作したポートフォリオサイトから個性豊かな表現も楽しめます。',
                actionTip: 'カードレイアウトや配色、スマートフォンでの操作性など、Webデザインの細かなこだわりポイントに注目してみましょう。'
            },
            ai: {
                howToView:
                    '市ヶ谷の隠れた名所を届けるマップや、大学祭の多彩な企画と来場者を繋ぐ検索サイト「フェスぽ」など、どのようにして人と情報とを結びつけているかという視点で展示を眺めてみてください。',
                actionTip: 'それぞれのWebサイトがどのような利用者を想定して作られているのか、紹介コメントとあわせてチェックしてみましょう。'
            },
            tech: {
                howToView:
                    '技術面と制作過程の両方で必見のコーナーです。実行委員会との共同開発や、プログラミング未経験の1年生が学習会を通じて本番サイトの開発を担うまで、成長したプロセスを学べます。',
                actionTip: 'ゼロからWeb開発を学んでサイトをチームで作るまでの学習法や開発の流れについて、ぜひ聞いてみてください。'
            }
        }
    }
];

/* application state */
const state = {
    currentStep: 0,
    answers: new Array(QUESTIONS.length).fill(null),
    sortMode: 'recommend',
    resultData: null
};

/* dom elements */
const screenIntro = document.getElementById('screen-intro');
const screenQuiz = document.getElementById('screen-quiz');
const screenResult = document.getElementById('screen-result');

const btnStart = document.getElementById('btn-start');
const btnPrev = document.getElementById('btn-prev');
const btnRetry = document.getElementById('btn-retry');

const quizQuestionText = document.getElementById('quiz-question-text');
const quizOptionsContainer = document.getElementById('quiz-options');

const resultTypeTitle = document.getElementById('result-type-title');
const resultTypeDesc = document.getElementById('result-type-desc');
const boothsGrid = document.getElementById('booths-grid');
const filterChips = document.querySelectorAll('.filter-chip');

/* initialize */
document.addEventListener('DOMContentLoaded', () => {
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            state.currentStep = 0;
            state.answers.fill(null);
            showScreen('quiz');
            renderQuestion();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (state.currentStep > 0) {
                state.currentStep -= 1;
                renderQuestion();
            } else {
                showScreen('intro');
            }
        });
    }

    if (btnRetry) {
        btnRetry.addEventListener('click', () => {
            state.currentStep = 0;
            state.answers.fill(null);
            showScreen('intro');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const sort = chip.getAttribute('data-sort');
            if (!sort || state.sortMode === sort) return;

            state.sortMode = sort;
            filterChips.forEach((c) => c.classList.toggle('is-active', c === chip));
            if (state.resultData) {
                renderBooths(state.resultData);
            }
        });
    });
});

/* switch visible screen */
function showScreen(screenName) {
    screenIntro.hidden = screenName !== 'intro';
    screenQuiz.hidden = screenName !== 'quiz';
    screenResult.hidden = screenName !== 'result';
}

/* render current question */
function renderQuestion() {
    const qIndex = state.currentStep;
    const questionObj = QUESTIONS[qIndex];

    quizQuestionText.textContent = questionObj.question;
    btnPrev.innerHTML = qIndex === 0
        ? '<span aria-hidden="true">&larr;</span> トップへ戻る'
        : '<span aria-hidden="true">&larr;</span> 前の質問へ';

    quizOptionsContainer.innerHTML = '';
    const currentAnswer = state.answers[qIndex];

    questionObj.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option-btn';
        if (currentAnswer === optIdx) {
            btn.classList.add('is-selected');
        }
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', currentAnswer === optIdx ? 'true' : 'false');

        btn.innerHTML = `
            <span class="quiz-option-key" aria-hidden="true">${escapeHtml(opt.key)}</span>
            <span class="quiz-option-text">${escapeHtml(opt.text)}</span>
        `;

        btn.addEventListener('click', () => {
            handleSelectOption(optIdx);
        });

        quizOptionsContainer.appendChild(btn);
    });
}

/* handle option click */
function handleSelectOption(optionIndex) {
    state.answers[state.currentStep] = optionIndex;

    const buttons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
        const selected = idx === optionIndex;
        btn.classList.toggle('is-selected', selected);
        btn.setAttribute('aria-checked', selected ? 'true' : 'false');
    });

    setTimeout(() => {
        if (state.currentStep < QUESTIONS.length - 1) {
            state.currentStep += 1;
            renderQuestion();
        } else {
            calculateAndShowResult();
        }
    }, 180);
}

/* compute scores and show result screen */
function calculateAndShowResult() {
    const axisScores = {
        action: 0,
        create: 0,
        ai: 0,
        tech: 0
    };

    const boothBonuses = {};
    BOOTHS.forEach((b) => {
        boothBonuses[b.id] = 0;
    });

    let isItl = false;

    state.answers.forEach((ansIdx, qIdx) => {
        if (ansIdx === null) return;
        const opt = QUESTIONS[qIdx].options[ansIdx];
        if (!opt) return;

        if (opt.isItl) {
            isItl = true;
        }

        if (opt.scores) {
            Object.keys(opt.scores).forEach((axis) => {
                axisScores[axis] += opt.scores[axis];
            });
        }

        if (Array.isArray(opt.boothBoost)) {
            opt.boothBoost.forEach((boothId) => {
                if (boothBonuses[boothId] !== undefined) {
                    boothBonuses[boothId] += 3;
                }
            });
        }
    });

    // determine primary and secondary axes
    const sortedAxes = Object.keys(axisScores).sort((a, b) => axisScores[b] - axisScores[a]);
    const topAxisKey = sortedAxes[0];
    const secondAxisKey = sortedAxes[1];

    // evaluate each booth match score
    const evaluatedBooths = BOOTHS.map((booth) => {
        const affinityScore =
            booth.affinityAxes.action * axisScores.action +
            booth.affinityAxes.create * axisScores.create +
            booth.affinityAxes.ai * axisScores.ai +
            booth.affinityAxes.tech * axisScores.tech +
            (boothBonuses[booth.id] || 0);

        // pick best viewpoint axis for user and booth
        // prefer secondary axis if score difference is small and booth affinity is higher
        let chosenAxis = topAxisKey;
        if (
            axisScores[topAxisKey] - axisScores[secondAxisKey] <= 2 &&
            booth.affinityAxes[secondAxisKey] > booth.affinityAxes[topAxisKey]
        ) {
            chosenAxis = secondAxisKey;
        }

        return {
            ...booth,
            matchScore: affinityScore,
            chosenAxis,
            viewpoint: booth.viewpoints[chosenAxis]
        };
    });

    // sort by match score to assign recommendations
    const rankedIds = [...evaluatedBooths]
        .sort((a, b) => b.matchScore - a.matchScore)
        .map((b) => b.id);

    evaluatedBooths.forEach((b) => {
        b.rank = rankedIds.indexOf(b.id) + 1;
    });

    state.resultData = {
        axisScores,
        topAxisKey,
        secondAxisKey,
        booths: evaluatedBooths,
        isItl
    };

    renderResultSummary(state.resultData);
    renderBooths(state.resultData);

    showScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* render result summary */
function renderResultSummary(data) {
    const primaryAxis = AXES[data.topAxisKey];
    resultTypeTitle.textContent = primaryAxis.title;
    resultTypeDesc.textContent = primaryAxis.description;

    const connectItlSection = document.getElementById('connect-itl-section');
    if (connectItlSection) {
        connectItlSection.hidden = !data.isItl;
    }
}

/* render all 7 booths with personalized viewing guide */
function renderBooths(data) {
    boothsGrid.innerHTML = '';

    const list = [...data.booths];
    if (state.sortMode === 'recommend') {
        list.sort((a, b) => a.rank - b.rank);
    } else {
        list.sort((a, b) => a.order - b.order);
    }

    const fragment = document.createDocumentFragment();

    list.forEach((booth) => {
        const isTopPick = booth.rank <= 3;
        const axisLabel = AXES[booth.chosenAxis].label;

        const card = document.createElement('article');
        card.className = `booth-card${isTopPick ? ' is-top-pick' : ''}`;

        card.innerHTML = `
            <div class="booth-card-header">
                <h3 class="booth-title">
                    <span class="booth-match-badge" aria-label="おすすめ順位：${booth.rank}">${booth.rank}</span>
                    <span class="booth-title-text">${escapeHtml(booth.title)}</span>
                </h3>
                <p class="booth-overview">${escapeHtml(booth.overview)}</p>
            </div>
            <div class="booth-viewpoint">
                <h4 class="booth-viewpoint-title">おすすめの楽しみ方（${escapeHtml(axisLabel)}）</h4>
                <p class="booth-viewpoint-text">${escapeHtml(booth.viewpoint.howToView)}</p>
                <p class="booth-action-tip">体験のコツ：${escapeHtml(booth.viewpoint.actionTip)}</p>
            </div>
        `;

        fragment.appendChild(card);
    });

    boothsGrid.appendChild(fragment);
}

/* escape html utility */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

