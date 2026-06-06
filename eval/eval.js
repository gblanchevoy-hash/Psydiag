'use strict';

// ── DATA ──────────────────────────────────────────────────────────────────────
const SYMPTOMS_DATA = [
  {id:1,name:"Avolition / Aboulie",cat:"Affect",def:"Diminution ou perte de la motivation, de la volont\u00e9 et de l\u2019initiative dans les activit\u00e9s quotidiennes."},
  {id:2,name:"\u00c9moussement des affects",cat:"Affect",def:"R\u00e9duction de l\u2019intensit\u00e9 et de l\u2019expression des r\u00e9ponses \u00e9motionnelles.",specs:["Partiel","Total"]},
  {id:3,name:"Troubles attentionnels",cat:"Attention",def:"Difficult\u00e9s \u00e0 maintenir, diriger ou d\u00e9placer l\u2019attention de fa\u00e7on appropri\u00e9e."},
  {id:4,name:"Tachypsychie",cat:"Cognitif",def:"Acc\u00e9l\u00e9ration du cours de la pens\u00e9e avec afflux d\u2019id\u00e9es rapides."},
  {id:5,name:"Bradypsychie",cat:"Cognitif",def:"Ralentissement du cours de la pens\u00e9e, difficult\u00e9 \u00e0 encha\u00eener les id\u00e9es."},
  {id:6,name:"R\u00e9p\u00e9titions compulsives",cat:"Comportement",def:"R\u00e9p\u00e9tition involontaire et st\u00e9r\u00e9otyp\u00e9e de comportements ou de pens\u00e9es malgr\u00e9 la r\u00e9sistance."},
  {id:7,name:"Labilit\u00e9 \u00e9motionnelle",cat:"Affect",def:"Variation rapide et incontr\u00f4l\u00e9e de l\u2019\u00e9tat \u00e9motionnel sans raison apparente."},
  {id:8,name:"Sth\u00e9nicit\u00e9",cat:"Comportement",def:"\u00c9nergie et dynamisme excessifs, tension motrice \u00e9lev\u00e9e."},
  {id:9,name:"Instabilit\u00e9 psychomotrice",cat:"Comportement",def:"Incapacit\u00e9 \u00e0 maintenir un comportement moteur stable, agitation permanente."},
  {id:10,name:"Excitation maniaque",cat:"Thymie",def:"\u00c9tat d\u2019euphorie intense, hyperactivit\u00e9, diminution du besoin de sommeil."},
  {id:11,name:"Agitation anxieuse",cat:"Anxiet\u00e9",def:"Agitation motrice li\u00e9e \u00e0 un \u00e9tat d\u2019anxi\u00e9t\u00e9 intense."},
  {id:12,name:"Agitation catatonique",cat:"Comportement",def:"Agitation st\u00e9r\u00e9otyp\u00e9e et non dirig\u00e9e vers un but, associ\u00e9e \u00e0 des signes catatoniques."},
  {id:13,name:"Agitation d\u00e9lirante",cat:"Psychotique",def:"Agitation en lien avec des id\u00e9es d\u00e9lirantes actives, comportement d\u00e9sorganis\u00e9."},
  {id:14,name:"Agitation confusionnelle",cat:"Cognitif",def:"Agitation associ\u00e9e \u00e0 un \u00e9tat confusionnel, d\u00e9sorientation temporo-spatiale."},
  {id:15,name:"D\u00e9sorganisation comportementale",cat:"Comportement",def:"Perturbation grave de la coh\u00e9rence et du but des comportements."},
  {id:16,name:"Ralentissement psychomoteur",cat:"Comportement",def:"Diminution globale de la vitesse des mouvements et de la pens\u00e9e."},
  {id:17,name:"Inhibition psychomotrice",cat:"Comportement",def:"Blocage partiel ou total des capacit\u00e9s motrices et mentales."},
  {id:18,name:"Akin\u00e9sie",cat:"Comportement",def:"Absence ou r\u00e9duction marqu\u00e9e des mouvements spontan\u00e9s."},
  {id:19,name:"Stupeur",cat:"Comportement",def:"\u00c9tat de mutisme et d\u2019immobilit\u00e9 avec maintien de la conscience."},
  {id:20,name:"Indiff\u00e9rence sociale",cat:"Relationnel",def:"Perte d\u2019int\u00e9r\u00eat pour les interactions sociales."},
  {id:21,name:"Trouble de reconnaissance \u00e9motionnelle",cat:"Affect",def:"Difficult\u00e9s \u00e0 identifier et interpr\u00e9ter les expressions \u00e9motionnelles d\u2019autrui."},
  {id:22,name:"Alexithymie",cat:"Affect",def:"Incapacit\u00e9 \u00e0 identifier, d\u00e9crire et diff\u00e9rencier ses propres \u00e9tats \u00e9motionnels."},
  {id:23,name:"Logorrh\u00e9e hostile",cat:"Comportement",def:"Flot de paroles excessif avec contenu agressif ou hostile.",specs:["Anxieuse","Hostile","Diffluente"]},
  {id:24,name:"Menaces verbales",cat:"Comportement",def:"Propos men\u00e7ants envers autrui, exprimant l\u2019intention de nuire."},
  {id:25,name:"Provocation verbale",cat:"Comportement",def:"Discours visant d\u00e9lib\u00e9r\u00e9ment \u00e0 provoquer une r\u00e9action hostile."},
  {id:26,name:"Hostilit\u00e9 verbale",cat:"Comportement",def:"Expression verbale d\u2019une attitude hostile, agressive ou m\u00e9prisante."},
  {id:27,name:"Violence verbale",cat:"Comportement",def:"Utilisation de mots, cris ou insultes \u00e0 vis\u00e9e blessante ou intimidante."},
  {id:28,name:"Violence physique",cat:"Comportement",def:"Passage \u00e0 l\u2019acte agressif avec contact physique sur autrui ou les objets."},
  {id:29,name:"Passage \u00e0 l\u2019acte h\u00e9t\u00e9ro-agressif",cat:"Comportement",def:"Acte agressif dirig\u00e9 vers une autre personne."},
  {id:30,name:"H\u00e9t\u00e9ro-agressivit\u00e9",cat:"Comportement",def:"Tendance comportementale \u00e0 diriger l\u2019agressivit\u00e9 vers les autres."},
  {id:31,name:"Impulsivit\u00e9 agressive",cat:"Comportement",def:"Passages \u00e0 l\u2019acte agressifs rapides, sans d\u00e9lib\u00e9ration pr\u00e9alable."},
  {id:32,name:"Opposition agressive",cat:"Comportement",def:"Refus syst\u00e9matique des demandes avec manifestations agressives."},
  {id:33,name:"D\u00e9sinhibition agressive",cat:"Comportement",def:"Lev\u00e9e des freins comportementaux avec expression non filtr\u00e9e de l\u2019agressivit\u00e9."},
  {id:34,name:"Comportement sociopathique",cat:"Comportement",def:"Conduites antisociales r\u00e9p\u00e9t\u00e9es, m\u00e9pris des normes et des droits d\u2019autrui."},
  {id:35,name:"D\u00e9faut d\u2019empathie",cat:"Relationnel",def:"Capacit\u00e9 r\u00e9duite \u00e0 percevoir et comprendre les \u00e9tats \u00e9motionnels des autres."},
  {id:36,name:"Perte d\u2019empathie",cat:"Relationnel",def:"Disparition de la capacit\u00e9 \u00e0 se mettre \u00e0 la place d\u2019autrui."},
  {id:37,name:"Froideur affective",cat:"Affect",def:"Distanciation \u00e9motionnelle marqu\u00e9e dans les relations interpersonnelles."},
  {id:38,name:"Callosit\u00e9 \u00e9motionnelle",cat:"Affect",def:"Insensibilit\u00e9 affective profonde, absence de remords ou de culpabilit\u00e9."},
  {id:39,name:"Alogie",cat:"Cognitif",def:"Pauvret\u00e9 du discours, r\u00e9duction quantitative de la pens\u00e9e exprim\u00e9e."},
  {id:40,name:"D\u00e9sinhibition verbale",cat:"Comportement",def:"Propos incontr\u00f4l\u00e9s, sans filtre, potentiellement d\u00e9plac\u00e9s."},
  {id:41,name:"D\u00e9sinhibition comportementale",cat:"Comportement",def:"Conduite non frein\u00e9e par les normes sociales habituelles."},
  {id:42,name:"Anosognosie",cat:"Jugement / Insight",def:"M\u00e9connaissance pathologique de sa propre maladie ou de ses sympt\u00f4mes."},
  {id:43,name:"Insight",cat:"Jugement / Insight",def:"Degr\u00e9 de conscience que le patient a de sa propre maladie et de ses sympt\u00f4mes.",specs:["Bon","Partiel","Absent"]},
  {id:45,name:"Anxi\u00e9t\u00e9 anticipatoire",cat:"Anxiet\u00e9",def:"Appr\u00e9hension anxieuse portant sur des \u00e9v\u00e9nements futurs redout\u00e9s."},
  {id:46,name:"D\u00e9pendance affective",cat:"Relationnel",def:"Besoin excessif de l\u2019approbation et de la pr\u00e9sence de l\u2019autre pour fonctionner."},
  {id:47,name:"Fragilit\u00e9 narcissique",cat:"Affect",def:"Sensibilit\u00e9 exacerb\u00e9e aux critiques, aux \u00e9checs et aux remises en cause de l\u2019estime de soi."},
  {id:48,name:"Ins\u00e9curit\u00e9 affective",cat:"Affect",def:"Sentiment persistant de ne pas \u00eatre aim\u00e9 ou de pouvoir \u00eatre abandonn\u00e9."},
  {id:49,name:"Angoisse de s\u00e9paration",cat:"Anxiet\u00e9",def:"Anxi\u00e9t\u00e9 intense li\u00e9e \u00e0 la s\u00e9paration r\u00e9elle ou imagin\u00e9e d\u2019une figure d\u2019attachement."},
  {id:50,name:"\u00c9puisement psychique",cat:"Somatique",def:"Fatigue mentale profonde avec r\u00e9duction des ressources cognitives et \u00e9motionnelles."},
  {id:51,name:"Athymhormie",cat:"Affect",def:"Perte simultan\u00e9e de l\u2019\u00e9lan vital, de l\u2019affectivit\u00e9 et de la volont\u00e9 d\u2019agir."},
  {id:52,name:"Apathie",cat:"Affect",def:"Diminution de la motivation, de l\u2019\u00e9motion et du comportement dirig\u00e9 vers un but.",specs:["Neurologique","Psychiatrique"]},
  {id:53,name:"Troubles de la concentration",cat:"Attention",def:"Difficult\u00e9s \u00e0 maintenir l\u2019attention focalis\u00e9e sur une t\u00e2che."},
  {id:54,name:"Attaques de panique",cat:"Anxiet\u00e9",def:"\u00c9pisodes soudains d\u2019anxi\u00e9t\u00e9 intense avec sympt\u00f4mes somatiques et sentiment de mort imminente."},
  {id:55,name:"Sentiment de culpabilit\u00e9 morbide",cat:"Thymie",def:"Conviction pathologique d\u2019avoir commis une faute grave, disproportionn\u00e9e \u00e0 la r\u00e9alit\u00e9."},
  {id:56,name:"Id\u00e9es de ruine",cat:"Thymie",def:"Conviction d\u00e9lirante ou quasi-d\u00e9lirante de ruine financi\u00e8re ou sociale imminente."},
  {id:57,name:"Id\u00e9es d\u2019indignit\u00e9",cat:"Thymie",def:"Conviction de sa propre d\u00e9valorisation, de ne m\u00e9riter aucune consid\u00e9ration."},
  {id:58,name:"Ambivalence des affects",cat:"Affect",def:"Coexistence simultan\u00e9e de sentiments oppos\u00e9s envers une m\u00eame personne ou situation."},
  {id:59,name:"Discordance id\u00e9o-affective",cat:"Affect",def:"Inad\u00e9quation entre le contenu des id\u00e9es exprim\u00e9es et la r\u00e9ponse \u00e9motionnelle associ\u00e9e."},
  {id:60,name:"Anxi\u00e9t\u00e9 diffuse",cat:"Anxiet\u00e9",def:"\u00c9tat anxieux chronique et g\u00e9n\u00e9ralis\u00e9 sans objet pr\u00e9cis identifiable."},
  {id:61,name:"Apragmatisme",cat:"Cognitif",def:"Incapacit\u00e9 \u00e0 r\u00e9aliser des actes pratiques adapt\u00e9s malgr\u00e9 les capacit\u00e9s cognitives pr\u00e9serv\u00e9es."},
  {id:62,name:"Isolement social",cat:"Relationnel",def:"Retrait progressif ou total des interactions sociales."},
  {id:63,name:"D\u00e9sengagement social",cat:"Relationnel",def:"Abandon progressif des relations et activit\u00e9s sociales ant\u00e9rieures."},
  {id:64,name:"Autolyse",cat:"Risque suicidaire",def:"Conduite d\u2019auto-destruction, suicidaire ou parasuicidaire."},
  {id:65,name:"Scarifications",cat:"Risque suicidaire",def:"Automutilations superficielles r\u00e9p\u00e9t\u00e9es sur la peau."},
  {id:66,name:"Anorexie mentale",cat:"App\u00e9tit",def:"Restriction alimentaire volontaire s\u00e9v\u00e8re avec distorsion de l\u2019image corporelle."},
  {id:67,name:"Boulimie",cat:"App\u00e9tit",def:"\u00c9pisodes r\u00e9currents d\u2019hyperphagie incontr\u00f4lable suivis de comportements compensatoires."},
  {id:68,name:"Blocage de la pens\u00e9e / Barrage",cat:"Cognitif",def:"Interruption soudaine et involontaire du cours de la pens\u00e9e en plein milieu."},
  {id:69,name:"Veille prolong\u00e9e sans fatigue",cat:"Sommeil",def:"R\u00e9duction du besoin de sommeil sans sensation de fatigue."},
  {id:70,name:"Insomnie",cat:"Sommeil",def:"Difficult\u00e9 \u00e0 initier ou maintenir le sommeil, ou r\u00e9veil pr\u00e9coce avec impact fonctionnel."},
  {id:71,name:"Hypervigilance",cat:"Anxiet\u00e9",def:"\u00c9tat d\u2019alerte permanent et excessif, sensibilit\u00e9 accrue aux stimuli environnementaux."},
  {id:72,name:"Man\u00e9risme",cat:"Comportement",def:"Mouvements ou gestes affect\u00e9s, pr\u00e9cieux, artificiels, sans fonctionnalit\u00e9 claire."},
  {id:73,name:"Comportement inadapt\u00e9 au contexte",cat:"Comportement",def:"Conduites inappropri\u00e9es par rapport aux normes situationnelles."},
  {id:74,name:"Excentricit\u00e9",cat:"Comportement",def:"Comportements, tenue ou discours nettement hors des normes sociales."},
  {id:75,name:"D\u00e9sorganisation psycho-comportementale",cat:"Comportement",def:"Perturbation globale de la coh\u00e9rence comportementale et de la conduite."},
  {id:76,name:"D\u00e9sorientation temporo-spatiale",cat:"Cognitif",def:"Perte des rep\u00e8res de temps et/ou d\u2019espace."},
  {id:77,name:"Appauvrissement des affects",cat:"Affect",def:"R\u00e9duction progressive de la richesse et de la diversit\u00e9 de la vie \u00e9motionnelle."},
  {id:78,name:"Anesth\u00e9sie affective",cat:"Affect",def:"Disparition totale de la capacit\u00e9 \u00e0 ressentir des \u00e9motions."},
  {id:79,name:"Catalepsie",cat:"Comportement",def:"Maintien rigide d\u2019une posture impos\u00e9e de l\u2019ext\u00e9rieur, flexibilit\u00e9 cireuse."},
  {id:80,name:"Cataplexie",cat:"Somatique",def:"Perte soudaine du tonus musculaire d\u00e9clench\u00e9e par une \u00e9motion."},
  {id:81,name:"Catatonie",cat:"Comportement",def:"Syndrome psychomoteur avec immobilit\u00e9, mutisme, st\u00e9r\u00e9otypies ou excitation."},
  {id:82,name:"Craving",cat:"Addictions",def:"Envie irr\u00e9pressible et intense de consommer une substance ou de r\u00e9aliser un comportement addictif."},
  {id:83,name:"Confusion mentale",cat:"Cognitif",def:"Alt\u00e9ration de la conscience avec d\u00e9sorientation, perplexit\u00e9 et incoh\u00e9rence."},
  {id:84,name:"Cauchemars",cat:"Sommeil",def:"R\u00eaves \u00e0 contenu anxieux ou terrifiants provoquant un r\u00e9veil en d\u00e9tresse."},
  {id:85,name:"Troubles somatoformes",cat:"Somatique",def:"Plaintes physiques non expliqu\u00e9es par une cause organique."},
  {id:86,name:"C\u00e9nesthopathies",cat:"Somatique",def:"Sensations corporelles p\u00e9nibles et bizarres sans substrat organique objectivable."},
  {id:87,name:"Claustrophobie",cat:"Anxiet\u00e9",def:"Peur intense des espaces clos ou confin\u00e9s."},
  {id:88,name:"Col\u00e8re paroxystique",cat:"Affect",def:"Acc\u00e8s de col\u00e8re explosive, soudaine et disproportionn\u00e9e."},
  {id:89,name:"Troubles compulsionnels",cat:"Comportement",def:"Comportements r\u00e9p\u00e9titifs r\u00e9alis\u00e9s pour r\u00e9duire une anxi\u00e9t\u00e9 ou selon des r\u00e8gles rigides."},
  {id:90,name:"Traits sociopathiques",cat:"Comportement",def:"Tendances comportementales antisociales persistantes."},
  {id:91,name:"Comportement \u00e9vitant",cat:"Comportement",def:"Tendance \u00e0 \u00e9viter les situations ou personnes g\u00e9n\u00e9ratrices d\u2019anxi\u00e9t\u00e9."},
  {id:92,name:"Opposition passive-agressive",cat:"Comportement",def:"R\u00e9sistance indirecte aux demandes via procrastination, obstruction passive, ironie."},
  {id:93,name:"Conduite suicidaire",cat:"Risque suicidaire",def:"Ensemble des comportements orient\u00e9s vers l\u2019auto-suppression, incluant les tentatives."},
  {id:94,name:"Menace suicidaire",cat:"Risque suicidaire",def:"Expression verbale de l\u2019intention de se donner la mort pour influencer l\u2019entourage."},
  {id:95,name:"Id\u00e9ations suicidaires",cat:"Risque suicidaire",def:"Pens\u00e9es r\u00e9currentes concernant le d\u00e9sir de mourir ou de se suicider.",specs:["Actives","Passives"]},
  {id:96,name:"Confabulations",cat:"Cognitif",def:"Production inconsciente de faux souvenirs pour combler des lacunes mn\u00e9siques."},
  {id:97,name:"Troubles de la conscience",cat:"Cognitif",def:"Alt\u00e9ration qualitative ou quantitative du niveau de conscience."},
  {id:98,name:"Conviction d\u00e9lirante",cat:"Psychotique",def:"Certitude absolue et in\u00e9branlable d\u2019une id\u00e9e fausse malgr\u00e9 les preuves contraires."},
  {id:99,name:"Coprolalie",cat:"Comportement",def:"\u00c9mission involontaire de mots obsc\u00e8nes ou socialement inacceptables."},
  {id:100,name:"Tristesse de l\u2019humeur",cat:"Thymie",def:"Abaissement persistant du tonus thymique avec coloration triste de la vie psychique."},
  {id:101,name:"Anh\u00e9donie",cat:"Thymie",def:"Perte de la capacit\u00e9 \u00e0 \u00e9prouver du plaisir dans les activit\u00e9s habituellement gratifiantes.",specs:["Partielle","Totale"]},
  {id:102,name:"D\u00e9sinvestissement occupationnel",cat:"Comportement",def:"Abandon progressif des activit\u00e9s professionnelles, de loisirs et des centres d\u2019int\u00e9r\u00eat."},
  {id:103,name:"Clinophilie",cat:"Comportement",def:"Tendance excessive \u00e0 rester au lit sans justification somatique."},
  {id:104,name:"Propos incoh\u00e9rents",cat:"Cognitif",def:"Discours sans logique interne, incompr\u00e9hensible pour l\u2019interlocuteur."},
  {id:105,name:"Discours d\u00e9cousu",cat:"Cognitif",def:"Pens\u00e9e avec ruptures associatives, transitions illogiques entre les id\u00e9es."},
  {id:106,name:"Circonlocutions",cat:"Cognitif",def:"Tendance \u00e0 s\u2019exprimer de fa\u00e7on d\u00e9tourn\u00e9e et excessive pour dire des choses simples."},
  {id:107,name:"\u00c9l\u00e9ments dissociatifs",cat:"Cognitif",def:"Perturbations de l\u2019int\u00e9gration de la conscience, de la m\u00e9moire, de l\u2019identit\u00e9."},
  {id:108,name:"Plaintes somatiques inexpliques",cat:"Somatique",def:"Sympt\u00f4mes physiques multiples sans cause organique retrouv\u00e9e, persistants."},
  {id:109,name:"\u00c9cholalie",cat:"Comportement",def:"R\u00e9p\u00e9tition automatique et involontaire des mots ou phrases prononc\u00e9s par l\u2019interlocuteur."},
  {id:110,name:"\u00c9chopraxie",cat:"Comportement",def:"Imitation involontaire des gestes ou mouvements d\u2019autrui."},
  {id:111,name:"Retrait social",cat:"Relationnel",def:"Abandon des contacts sociaux, repli sur soi progressif."},
  {id:112,name:"\u00c9lation de l\u2019humeur",cat:"Thymie",def:"\u00c9l\u00e9vation pathologique de l\u2019humeur avec euphorie et sentiment de bien-\u00eatre excessif."},
  {id:113,name:"D\u00e9ni",cat:"Jugement / Insight",def:"M\u00e9canisme de d\u00e9fense consistant \u00e0 nier la r\u00e9alit\u00e9 d\u2019une situation mena\u00e7ante."},
  {id:114,name:"D\u00e9n\u00e9gation",cat:"Jugement / Insight",def:"Refus verbal de reconna\u00eetre une v\u00e9rit\u00e9 tout en la manifestant indirectement."},
  {id:115,name:"Irritabilit\u00e9",cat:"Affect",def:"R\u00e9activit\u00e9 \u00e9motionnelle excessive, susceptibilit\u00e9, faible tol\u00e9rance aux frustrations."},
  {id:116,name:"Pens\u00e9es magiques",cat:"Cognitif",def:"Croyance que ses pens\u00e9es ou actions peuvent influencer des \u00e9v\u00e9nements ext\u00e9rieurs."},
  {id:117,name:"Asth\u00e9nie psychique",cat:"Somatique",def:"Fatigue mentale prononc\u00e9e r\u00e9duisant les capacit\u00e9s d\u2019effort intellectuel."},
  {id:118,name:"Flashbacks",cat:"Anxiet\u00e9",def:"Reviviscences involontaires et intrusives d\u2019un \u00e9v\u00e9nement traumatique."},
  {id:119,name:"Fugues dissociatives",cat:"Cognitif",def:"Voyages ou d\u00e9placements soudains accompagn\u00e9s d\u2019une amn\u00e9sie de l\u2019identit\u00e9."},
  {id:120,name:"Amn\u00e9sie dissociative",cat:"Cognitif",def:"Perte de m\u00e9moire d\u2019informations autobiographiques importantes, sans cause organique."},
  {id:121,name:"Troubles mn\u00e9siques",cat:"Cognitif",def:"Alt\u00e9rations de la m\u00e9moire (encodage, stockage ou r\u00e9cup\u00e9ration)."},
  {id:122,name:"Paramn\u00e9sies",cat:"Cognitif",def:"D\u00e9formations pathologiques des souvenirs."},
  {id:123,name:"Paralogisme",cat:"Cognitif",def:"Raisonnement erron\u00e9 fond\u00e9 sur une logique propre non partag\u00e9e."},
  {id:124,name:"Anxi\u00e9t\u00e9 chronique",cat:"Anxiet\u00e9",def:"\u00c9tat anxieux persistant de faible \u00e0 moyenne intensit\u00e9 depuis au moins 6 mois."},
  {id:125,name:"Fatigue chronique",cat:"Somatique",def:"\u00c9puisement physique et mental persistant, non soula g\u00e9 par le repos."},
  {id:126,name:"Somnolence diurne",cat:"Sommeil",def:"Tendance excessive \u00e0 s\u2019endormir dans la journ\u00e9e."},
  {id:127,name:"Fuite des id\u00e9es",cat:"Cognitif",def:"Acc\u00e9l\u00e9ration du cours de la pens\u00e9e avec passage rapide d\u2019une id\u00e9e \u00e0 l\u2019autre."},
  {id:128,name:"Logorrh\u00e9e",cat:"Comportement",def:"Flux verbal excessif, difficile \u00e0 interrompre.",specs:["Anxieuse","Hostile","Diffluente"]},
  {id:129,name:"Pens\u00e9es autolytiques",cat:"Risque suicidaire",def:"Pens\u00e9es orient\u00e9es vers l\u2019auto-destruction.",specs:["Actives","Passives"]},
  {id:130,name:"Pr\u00e9occupations autour de la mort",cat:"Risque suicidaire",def:"Ruminations persistantes sur la mort, le deuil, la finitude."},
  {id:131,name:"Pens\u00e9es obs\u00e9dantes / Intrusives",cat:"Anxiet\u00e9",def:"Pens\u00e9es r\u00e9currentes, non d\u00e9sir\u00e9es, g\u00e9n\u00e9rant de la d\u00e9tresse."},
  {id:132,name:"Impulsivit\u00e9",cat:"Comportement",def:"Tendance \u00e0 agir sans r\u00e9flexion pr\u00e9alable suffisante."},
  {id:133,name:"Troubles du jugement",cat:"Jugement / Insight",def:"Alt\u00e9ration de la capacit\u00e9 \u00e0 \u00e9valuer correctement les situations."},
  {id:134,name:"Alt\u00e9ration des fonctions ex\u00e9cutives",cat:"Cognitif",def:"Perturbation des capacit\u00e9s de planification, d\u2019organisation et de flexibilit\u00e9 cognitive."},
  {id:135,name:"Difficult\u00e9s d\u00e9cisionnelles",cat:"Cognitif",def:"Incapacit\u00e9 \u00e0 prendre des d\u00e9cisions dans un d\u00e9lai raisonnable."},
  {id:136,name:"D\u00e9sorganisation affective",cat:"Affect",def:"Incoh\u00e9rence et d\u00e9sint\u00e9gration des r\u00e9ponses \u00e9motionnelles."},
  {id:137,name:"Hallucinations auditives",cat:"Psychotique",def:"Perceptions auditives sans stimulus externe.",specs:["Acoustico-verbale","Intrapsychique","Critiqu\u00e9es","Non-critiqu\u00e9es"]},
  {id:138,name:"Hallucinations visuelles",cat:"Psychotique",def:"Perceptions visuelles sans stimulus externe.",specs:["Color\u00e9es","Sombres","Organis\u00e9es","D\u00e9sorganis\u00e9es","Critiqu\u00e9e","Non-critiqu\u00e9e"]},
  {id:139,name:"Hallucinations mn\u00e9siques",cat:"Psychotique",def:"Faux souvenirs v\u00e9cus comme des perceptions r\u00e9elles."},
  {id:140,name:"Hallucinations hypnopompiques",cat:"Sommeil",def:"Hallucinations survenant au r\u00e9veil, lors de la transition sommeil-\u00e9veil."},
  {id:141,name:"Hallucinations hypnagogiques",cat:"Sommeil",def:"Hallucinations survenant \u00e0 l\u2019endormissement."},
  {id:142,name:"Hallucinations traumatiques",cat:"Psychotique",def:"Hallucinations en lien avec un contenu traumatique.",specs:["Visuelles","Olfactives","Gustatives","Auditives","Som\u00e9sth\u00e9siques"]},
  {id:143,name:"Hallucinations c\u00e9nesth\u00e9siques",cat:"Psychotique",def:"Sensations corporelles anormales per\u00e7ues sans stimulus, de nature hallucinatoire."},
  {id:144,name:"Hyperactivit\u00e9",cat:"Comportement",def:"Niveau d\u2019activit\u00e9 motrice et/ou mentale excessif, difficile \u00e0 r\u00e9guler."},
  {id:145,name:"Hypersensibilit\u00e9 affective",cat:"Affect",def:"R\u00e9activit\u00e9 \u00e9motionnelle disproportionn\u00e9e aux stimuli environnementaux."},
  {id:146,name:"Sensitivit\u00e9 relationnelle",cat:"Relationnel",def:"Vuln\u00e9rabilit\u00e9 excessive aux jugements, critiques et attitudes d\u2019autrui."},
  {id:147,name:"Hyperphagie",cat:"App\u00e9tit",def:"Consommation alimentaire excessive, bien au-del\u00e0 des besoins caloriques."},
  {id:148,name:"Anorexie",cat:"App\u00e9tit",def:"Perte ou diminution significative de l\u2019app\u00e9tit."},
  {id:149,name:"Conduites purgatoires",cat:"App\u00e9tit",def:"Comportements compensatoires apr\u00e8s ingestion alimentaire : vomissements, laxatifs."},
  {id:150,name:"D\u00e9pression double",cat:"Thymie",def:"D\u00e9pression chronique (dysthymie) avec survenue d\u2019un \u00e9pisode d\u00e9pressif caract\u00e9ris\u00e9."},
  {id:151,name:"Hypomanie",cat:"Thymie",def:"\u00c9tat d\u2019\u00e9lation mod\u00e9r\u00e9e de l\u2019humeur, moins s\u00e9v\u00e8re que la manie."},
  {id:152,name:"Hypoprosexie",cat:"Attention",def:"Diminution l\u00e9g\u00e8re \u00e0 mod\u00e9r\u00e9e de la capacit\u00e9 attentionnelle."},
  {id:153,name:"Kleptomanie",cat:"Comportement",def:"Impulsion r\u00e9currente et irr\u00e9sistible \u00e0 voler des objets non n\u00e9cessaires."},
  {id:154,name:"Mutisme",cat:"Comportement",def:"Absence de production verbale sans atteinte des organes phonatoires."},
  {id:155,name:"Comportement m\u00e9fiant",cat:"Comportement",def:"Attitude de suspicion persistante envers l\u2019entourage sans justification objective."},
  {id:156,name:"M\u00e9galomanie",cat:"Psychotique",def:"Conviction d\u00e9lirante d\u2019une valeur, puissance, richesse ou mission exceptionnelle."},
  {id:157,name:"Misophonie",cat:"Anxiet\u00e9",def:"R\u00e9action \u00e9motionnelle intense et incontr\u00f4lable \u00e0 certains sons sp\u00e9cifiques."},
  {id:158,name:"Troubles de la m\u00e9moire ant\u00e9rograde",cat:"Cognitif",def:"Impossibilit\u00e9 ou difficult\u00e9 \u00e0 encoder de nouvelles informations apr\u00e8s un \u00e9v\u00e9nement."},
  {id:159,name:"Troubles de la m\u00e9moire r\u00e9trograde",cat:"Cognitif",def:"Perte des souvenirs d\u2019\u00e9v\u00e9nements ant\u00e9rieurs \u00e0 un trauma ou une maladie."},
  {id:160,name:"Nervosisme",cat:"Anxiet\u00e9",def:"\u00c9tat de tension nerveuse persistante, d\u2019irritabilit\u00e9 et d\u2019agitation l\u00e9g\u00e8re."},
  {id:161,name:"Orthorexie",cat:"App\u00e9tit",def:"Obsession pathologique pour une alimentation saine, avec restrictions rigides et anxi\u00e9t\u00e9."},
  {id:162,name:"Bigorexie",cat:"Comportement",def:"Obsession pathologique de l\u2019exercice physique, dysperception corporelle."},
  {id:163,name:"Hostilit\u00e9 / D\u00e9fiance",cat:"Comportement",def:"Attitude syst\u00e9matiquement hostile et m\u00e9fiante envers l\u2019environnement social."},
  {id:164,name:"Palilalie",cat:"Comportement",def:"R\u00e9p\u00e9tition involontaire et de plus en plus rapide de ses propres mots ou syllabes."},
  {id:165,name:"Paran\u00f6a",cat:"Psychotique",def:"D\u00e9veloppement insidieux d\u2019un d\u00e9lire syst\u00e9matis\u00e9 de pers\u00e9cution."},
  {id:166,name:"Pers\u00e9v\u00e9rations id\u00e9iques",cat:"Cognitif",def:"Tendance pathologique \u00e0 r\u00e9p\u00e9ter les m\u00eames id\u00e9es de fa\u00e7on inadapt\u00e9e."},
  {id:167,name:"Peur exag\u00e9r\u00e9e dans le contexte",cat:"Anxiet\u00e9",def:"R\u00e9action de peur disproportionn\u00e9e \u00e0 la menace r\u00e9elle d\u2019une situation."},
  {id:168,name:"Pica",cat:"App\u00e9tit",def:"Ing\u00e9stion persistante de substances non comestibles ou sans valeur nutritive."},
  {id:169,name:"Pleurs immotiv\u00e9s",cat:"Affect",def:"Crises de larmes sans d\u00e9clencheur \u00e9motionnel identifiable ou disproportionn\u00e9es."},
  {id:170,name:"Inqui\u00e9tudes somatiques inappropri\u00e9es",cat:"Somatique",def:"Pr\u00e9occupations excessives concernant l\u2019\u00e9tat de sant\u00e9 physique sans justification m\u00e9dicale."},
  {id:171,name:"Incontinence verbale",cat:"Comportement",def:"Production verbale incontr\u00f4l\u00e9e, sans censure ni coh\u00e9rence adaptative."},
  {id:172,name:"Procrastination pathologique",cat:"Comportement",def:"Report syst\u00e9matique des t\u00e2ches avec impact fonctionnel significatif."},
  {id:173,name:"Prosodie modifi\u00e9e",cat:"Comportement",def:"Alt\u00e9ration du rythme, de l\u2019intonation ou de la m\u00e9lodie de la parole."},
  {id:174,name:"Qu\u00e9rulence",cat:"Comportement",def:"Tendance pathologique \u00e0 multiplier les plaintes, revendications et proc\u00e8s."},
  {id:175,name:"Raptus suicidaire",cat:"Risque suicidaire",def:"Passage \u00e0 l\u2019acte suicidaire impulsif, soudain, souvent sans signe avant-coureur."},
  {id:176,name:"Trouble de la flexibilit\u00e9 cognitive",cat:"Cognitif",def:"Difficult\u00e9s \u00e0 adapter sa pens\u00e9e ou son comportement face \u00e0 des changements de r\u00e8gles."},
  {id:177,name:"Rituels compulsifs",cat:"Comportement",def:"S\u00e9quences comportementales r\u00e9p\u00e9titives r\u00e9alis\u00e9es pour neutraliser une obsession."},
  {id:178,name:"Ruminations anxieuses",cat:"Anxiet\u00e9",def:"Pens\u00e9es r\u00e9p\u00e9titives et envahissantes centr\u00e9es sur des pr\u00e9occupations anxieuses."},
  {id:179,name:"Sentiment de vide existentiel",cat:"Affect",def:"Exp\u00e9rience subjective d\u2019un manque de sens, de substance int\u00e9rieure et d\u2019identit\u00e9."},
  {id:180,name:"Sid\u00e9ration psychique",cat:"Cognitif",def:"Arr\u00eat brutal des processus mentaux face \u00e0 un stimulus traumatique ou intense."},
  {id:181,name:"Schizophasie",cat:"Cognitif",def:"Discours extr\u00eamement d\u00e9sorganis\u00e9, inintelligible, avec associations incoh\u00e9rentes."},
  {id:182,name:"Verbig\u00e9ration",cat:"Comportement",def:"R\u00e9p\u00e9tition st\u00e9r\u00e9otyp\u00e9e de mots ou phrases sans signification communicationnelle."},
  {id:183,name:"Soliloque",cat:"Comportement",def:"Discours adress\u00e9 \u00e0 soi-m\u00eame, parfois en r\u00e9ponse \u00e0 des hallucinations."},
  {id:184,name:"Trouble psychosomatique",cat:"Somatique",def:"Manifestation somatique d\u2019un conflit psychologique, avec l\u00e9sion organique r\u00e9elle."},
  {id:185,name:"St\u00e9r\u00e9otypies comportementales",cat:"Comportement",def:"Mouvements ou comportements r\u00e9p\u00e9titifs, invariants, sans but apparent."},
  {id:186,name:"\u00c9nur\u00e9sie",cat:"Somatique",def:"Mictions involontaires sans l\u00e9sion urologique, souvent nocturnes."},
  {id:187,name:"Encropresie",cat:"Somatique",def:"D\u00e9f\u00e9cation involontaire sans cause organique, apr\u00e8s l\u2019\u00e2ge de la propret\u00e9 acquise."},
];

const CAT_HUE = {
  "Affect": 250,
  "Attention": 190,
  "Cognitif": 210,
  "Comportement": 160,
  "Thymie": 280,
  "Anxiété": 35,
  "Psychotique": 320,
  "Relationnel": 170,
  "Jugement / Insight": 55,
  "Somatique": 15,
  "Risque suicidaire": 0,
  "Appétit": 130,
  "Sommeil": 225,
  "Addictions": 300,
};


const RUD_DATA = {
  aigus:[
    "Id\u00e9ation suicidaire active avec plan",
    "Acc\u00e8s aux moyens l\u00e9taux",
    "Tentative r\u00e9cente",
    "Agitation psychomotrice intense",
    "Intoxication aigu\u00eb",
    "S\u00e9paration / rupture r\u00e9cente",
    "Perte d\u2019emploi r\u00e9cente",
    "Deuil r\u00e9cent",
    "Sortie r\u00e9cente d\u2019hospitalisation"
  ],
  chroniques:[
    "Ant\u00e9c\u00e9dents de tentative de suicide",
    "Trouble de la personnalit\u00e9",
    "Trouble bipolaire",
    "D\u00e9pression s\u00e9v\u00e8re",
    "Abus de substances",
    "Isolement social",
    "Douleur chronique",
    "Maladie somatique grave",
    "Impulsivit\u00e9 chronique"
  ],
  protection:[
    "Soutien familial / social",
    "Projet de vie",
    "Enfants \u00e0 charge",
    "Croyances religieuses",
    "Engagement dans le soin",
    "Insight partiel ou complet",
    "Stabilit\u00e9 du logement",
    "Emploi ou activit\u00e9",
    "R\u00e9seau de soins actif"
  ]
};

// ── STATE ──────────────────────────────────────────────────────────────────────
const state = {
  step: 0,
  selectedSymp: {},
  intensities: {},
  specs: {},
  catFilter: "Tous",
  rudChecked: {},
  searchVal: "",
  riskScores: {},
  riskChecked: {}
};

// ── NAVIGATION ─────────────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll(".page").forEach(function(p) { p.classList.remove("active"); });
  document.getElementById("page-" + id).classList.add("active");
  document.querySelectorAll(".nav-btn").forEach(function(b) { b.classList.remove("active"); });
  var navBtn = document.getElementById("nav-" + id);
  if (navBtn) navBtn.classList.add("active");
  window.scrollTo(0, 0);
}

function goStep(n) {
  state.step = n;
  document.querySelectorAll(".tab-panel").forEach(function(p, i) {
    p.classList.toggle("tab-active", i === n);
  });
  document.querySelectorAll(".step-btn").forEach(function(b, i) {
    b.classList.remove("step-active", "step-done");
    if (i === n) b.classList.add("step-active");
    else if (i < n) b.classList.add("step-done");
  });
  if (n === 1) { buildPresentationTab(); }
  if (n === 3) updateRudAlert();
  if (n === 4) { buildRiskFactors(); setTimeout(buildRadarChart, 80); }
  if (n === 5) { /* synthese */ }
  showPage("eval");
  window.scrollTo(0, 0);
}

// ── IMC ────────────────────────────────────────────────────────────────────────
function calcIMC() {
  var p = parseFloat(document.getElementById("p-poids").value);
  var t = parseFloat(document.getElementById("p-taille").value);
  var imcEl = document.getElementById("p-imc");
  var commentEl = document.getElementById("imc-comment");
  var barEl = document.getElementById("imc-bar");
  if (!p || !t) {
    if (imcEl) imcEl.textContent = "—";
    if (commentEl) commentEl.textContent = "";
    if (barEl) barEl.style.width = "0%";
    return;
  }
  var v = (p / Math.pow(t / 100, 2));
  var vStr = v.toFixed(1);
  if (imcEl) imcEl.textContent = vStr;
  
  var comment = "", color = "", pct = 0;
  if (v < 16.5)      { comment = "Dénutrition sévère"; color = "#ef4444"; pct = 5; }
  else if (v < 18.5) { comment = "Maigreur"; color = "#f97316"; pct = 15; }
  else if (v < 25)   { comment = "Corpulence normale"; color = "#22c55e"; pct = Math.round((v-18.5)/6.5*40)+20; }
  else if (v < 27)   { comment = "Surpoids limite"; color = "#f59e0b"; pct = 65; }
  else if (v < 30)   { comment = "Surpoids"; color = "#f97316"; pct = 72; }
  else if (v < 35)   { comment = "Obésité modérée"; color = "#ef4444"; pct = 82; }
  else if (v < 40)   { comment = "Obésité sévère"; color = "#dc2626"; pct = 90; }
  else               { comment = "Obésité morbide"; color = "#b91c1c"; pct = 98; }
  
  if (commentEl) { commentEl.textContent = comment; commentEl.style.color = color; }
  if (barEl) { barEl.style.width = pct + "%"; barEl.style.background = color; }
}

function toggleEnfants() {
  var v = document.getElementById("p-enfants").value;
  document.getElementById("nb-enfants-field").style.display = (v === "oui") ? "" : "none";
}

// ── CATEGORIES ─────────────────────────────────────────────────────────────────
var CATEGORIES = (function() {
  var cats = ["Tous"];
  var seen = {};
  SYMPTOMS_DATA.forEach(function(s) {
    if (!seen[s.cat]) { seen[s.cat] = true; cats.push(s.cat); }
  });
  cats.sort(function(a, b) { return a === "Tous" ? -1 : a.localeCompare(b); });
  return cats;
})();

function buildCatList() {
  var counts = {};
  SYMPTOMS_DATA.forEach(function(s) { counts[s.cat] = (counts[s.cat] || 0) + 1; });
  var el = document.getElementById("cat-list");
  el.innerHTML = "";
  CATEGORIES.forEach(function(cat) {
    var d = document.createElement("div");
    d.className = "cat-item" + (cat === state.catFilter ? " cat-active" : "");
    var count = cat === "Tous" ? SYMPTOMS_DATA.length : (counts[cat] || 0);
    var hue = CAT_HUE[cat];
    var dot = (hue !== undefined)
      ? "<span class=\"cat-dot\" style=\"background:hsl(" + hue + ",60%,55%)\"></span>"
      : "<span class=\"cat-dot\" style=\"background:var(--text3)\"></span>";
    d.innerHTML = dot + "<span>" + cat + "</span><span class=\"cat-count\">" + count + "</span>";
    d.addEventListener("click", function() {
      state.catFilter = cat;
      buildCatList();
      renderSymptoms();
    });
    el.appendChild(d);
  });
}

// ── SYMPTOMS ───────────────────────────────────────────────────────────────────
function renderSymptoms() {
  var search = (state.searchVal || "").toLowerCase();
  var filtered = SYMPTOMS_DATA.filter(function(s) {
    var matchCat = state.catFilter === "Tous" || s.cat === state.catFilter;
    var matchSearch = !search || s.name.toLowerCase().indexOf(search) >= 0;
    return matchCat && matchSearch;
  });

  var sel = Object.values(state.selectedSymp).filter(Boolean).length;
  var lbl = document.getElementById("symp-count-label");
  lbl.textContent = sel > 0 ? ("\u2014 " + sel + " s\u00e9lectionn\u00e9" + (sel > 1 ? "s" : "")) : "";

  var list = document.getElementById("symp-list");
  list.innerHTML = "";

  filtered.forEach(function(s) {
    var isSel = !!state.selectedSymp[s.id];
    var intVal = state.intensities[s.id] || "";
    var specArr = state.specs[s.id] || [];

    var card = document.createElement("div");
    card.className = "symp-card" + (isSel ? " selected" : "");

    var specsHtml = "";
    if (isSel && s.specs) {
      s.specs.forEach(function(sp) {
        var isActive = specArr.indexOf(sp) >= 0;
        specsHtml += "<button class=\"spec-btn" + (isActive ? " active" : "") + "\" data-id=\"" + s.id + "\" data-sp=\"" + sp + "\">" + sp + "</button>";
      });
    }

    var optionsHtml = "";
    if (isSel) {
      optionsHtml = "<div class=\"symp-options\">" +
        "<div class=\"symp-opt-label\">Intensit\u00e9</div>" +
        "<button class=\"int-btn il" + (intVal === "l" ? " active" : "") + "\" data-id=\"" + s.id + "\" data-k=\"l\">L\u00e9ger</button>" +
        "<button class=\"int-btn im" + (intVal === "m" ? " active" : "") + "\" data-id=\"" + s.id + "\" data-k=\"m\">Mod\u00e9r\u00e9</button>" +
        "<button class=\"int-btn ih" + (intVal === "h" ? " active" : "") + "\" data-id=\"" + s.id + "\" data-k=\"h\">Important</button>" +
        specsHtml +
        "</div>";
    }

    var catClass = "cat-" + (s.cat ? s.cat.replace(/[^a-zA-Z]/g, "").substring(0, 12) : "");
    var catHue = CAT_HUE[s.cat] !== undefined ? CAT_HUE[s.cat] : 210;
    card.setAttribute("style", "--cat-h:" + catHue);
    card.className = "symp-card" + (isSel ? " selected" : "");

    card.innerHTML =
      "<div class=\"symp-top\">" +
        "<div class=\"symp-cb" + (isSel ? " checked" : "") + "\" data-id=\"" + s.id + "\">" + (isSel ? "\u2713" : "") + "</div>" +
        "<div style=\"flex:1\">" +
          "<div class=\"symp-name\" data-id=\"" + s.id + "\">" +
            s.name + " <span class=\"symp-cat-badge\">" + s.cat + "</span>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<div class=\"symp-tooltip\">" + s.def + "</div>" +
      optionsHtml;

    list.appendChild(card);
  });

  // Event delegation
  list.querySelectorAll(".symp-cb, .symp-name[data-id]").forEach(function(el) {
    el.addEventListener("click", function() {
      var id = parseInt(this.dataset.id);
      state.selectedSymp[id] = !state.selectedSymp[id];
      if (!state.selectedSymp[id]) { delete state.intensities[id]; delete state.specs[id]; }
      renderSymptoms();
    });
  });
  list.querySelectorAll(".int-btn").forEach(function(el) {
    el.addEventListener("click", function() {
      var id = parseInt(this.dataset.id);
      var k = this.dataset.k;
      state.intensities[id] = (state.intensities[id] === k) ? null : k;
      renderSymptoms();
    });
  });
  list.querySelectorAll(".spec-btn").forEach(function(el) {
    el.addEventListener("click", function() {
      var id = parseInt(this.dataset.id);
      var sp = this.dataset.sp;
      if (!state.specs[id]) state.specs[id] = [];
      var idx = state.specs[id].indexOf(sp);
      if (idx >= 0) state.specs[id].splice(idx, 1); else state.specs[id].push(sp);
      renderSymptoms();
    });
  });
}

function filterSymptoms(val) {
  state.searchVal = (typeof val === "string") ? val : "";
  renderSymptoms();
}

function updatePreview() {
  var selected = SYMPTOMS_DATA.filter(function(s) { return state.selectedSymp[s.id]; });
  var el = document.getElementById("selected-preview");
  if (!el) return;
  if (!selected.length) {
    el.innerHTML = "<p style=\"color:var(--text3);font-size:13px\">Aucun sympt\u00f4me s\u00e9lectionn\u00e9.</p>";
    return;
  }
  el.innerHTML = selected.map(function(s) {
    var int = state.intensities[s.id];
    var intLabel = int ? {l:"l\u00e9ger", m:"mod\u00e9r\u00e9", h:"important"}[int] : "";
    return "<span class=\"preview-tag\">" + s.name + (intLabel ? " \u00b7 " + intLabel : "") + "</span>";
  }).join("");
}

// ── RUD ────────────────────────────────────────────────────────────────────────
function buildRud() {
  var grid = document.getElementById("rud-grid");
  grid.innerHTML = "";
  var cols = [["Facteurs aigus","aigus"],["Facteurs chroniques","chroniques"],["Facteurs de protection","protection"]];
  cols.forEach(function(pair) {
    var title = pair[0]; var key = pair[1];
    var col = document.createElement("div");
    col.className = "rud-col";
    var html = "<h4>" + title + "</h4>";
    RUD_DATA[key].forEach(function(item) {
      var checked = !!state.rudChecked[item];
      html += "<div class=\"rud-item\" data-item=\"" + item + "\">" +
        "<div class=\"rud-cb" + (checked ? " checked" : "") + "\">" + (checked ? "\u2713" : "") + "</div>" +
        "<span>" + item + "</span></div>";
    });
    col.innerHTML = html;
    col.querySelectorAll(".rud-item").forEach(function(el) {
      el.addEventListener("click", function() {
        var item = this.dataset.item;
        state.rudChecked[item] = !state.rudChecked[item];
        buildRud();
      });
    });
    grid.appendChild(col);
  });
  updateRudScore();
}

function updateRudScore() {
  var score = Object.values(state.rudChecked).filter(Boolean).length;
  var el = document.getElementById("rud-score");
  var interp = document.getElementById("rud-interp");
  el.innerHTML = score + "<span style=\"font-size:24px\">/27</span>";
  el.className = "rud-score " + (score <= 3 ? "low" : score <= 6 ? "med" : "high");
  interp.textContent = score <= 3 ? "Risque faible \u2013 suivi ambulatoire" :
    score <= 6 ? "Risque mod\u00e9r\u00e9 \u2013 r\u00e9\u00e9valuation rapide recommand\u00e9e" :
    "Risque \u00e9lev\u00e9 \u2013 hospitalisation \u00e0 envisager";
}

function updateRudAlert() {
  var has = SYMPTOMS_DATA.some(function(s) { return s.cat === "Risque suicidaire" && state.selectedSymp[s.id]; });
  document.getElementById("rud-alert").style.display = has ? "" : "none";
}

// ── SYNTHESIS ──────────────────────────────────────────────────────────────────
function getVal(id) { var el = document.getElementById(id); return el ? el.value : ""; }





function resetAll() {
  if (!confirm("R\u00e9initialiser toutes les donn\u00e9es ?")) return;
  state.step = 0; state.selectedSymp = {}; state.intensities = {};
  state.specs = {}; state.catFilter = "Tous"; state.rudChecked = {};
  document.querySelectorAll("#tab-0 input, #tab-0 select, #tab-0 textarea").forEach(function(el) { el.value = ""; });
  document.getElementById("nb-enfants-field").style.display = "none";
  document.getElementById("synthesis-output").innerHTML = "<div class=\"synth-placeholder\">G\u00e9n\u00e9rez la synth\u00e8se depuis l\u2019onglet Risque, ou cliquez sur R\u00e9g\u00e9n\u00e9rer.</div>";
  document.getElementById("btn-copy").style.display = "none";
  document.getElementById("btn-print").style.display = "none";
  document.getElementById("btn-reset").style.display = "none";
  buildCatList(); renderSymptoms(); buildRud(); goStep(0);
}

// ── PARTICLES ──────────────────────────────────────────────────────────────────
function initParticles() {
  var canvas = document.getElementById("particles");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W, H;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener("resize", resize);
  var pts = [];
  for (var i = 0; i < 70; i++) {
    pts.push({ x: Math.random()*1000, y: Math.random()*800, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4, r: Math.random()*1.5+.5 });
  }
  (function loop() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(function(p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "rgba(79,124,255,0.55)"; ctx.fill();
    });
    for (var i = 0; i < pts.length; i++) {
      for (var j = i+1; j < pts.length; j++) {
        var dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y;
        var d = Math.sqrt(dx*dx+dy*dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = "rgba(79,124,255," + (0.18*(1-d/110)) + ")";
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  })();
}

// ── INIT ───────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  // Set today's date as default
  var dateEl = document.getElementById("p-date");
  if (dateEl && !dateEl.value) {
    var today = new Date();
    dateEl.value = today.getFullYear() + "-" +
      String(today.getMonth()+1).padStart(2,"0") + "-" +
      String(today.getDate()).padStart(2,"0");
  }
  buildCatList();
  renderSymptoms();
  buildRud();
  buildRiskFactors();
  initParticles();
});

/* ================================================================
   PRÉSENTATION CLINIQUE — DATA COMPLÈTE (selon PROMPT_DE_DÉVELOPPEMENT)
   ================================================================ */
const PRES_CHIPS = {
  /* ── APPARENCE GÉNÉRALE ── */
  hygiene: [
    {id:'hyg_correcte',  label:'Hygiène correcte',       style:''},
    {id:'hyg_negligee',  label:'Hygiène négligée',       style:'warn'},
    {id:'hyg_degradee',  label:'Hygiène très dégradée',  style:'danger'},
  ],
  tenue: [
    {id:'ten_adaptee',   label:'Adaptée',                style:''},
    {id:'ten_inadaptee', label:'Inadaptée',              style:'warn'},
    {id:'ten_extrav',    label:'Extravagante',           style:'warn'},
    {id:'ten_provoc',    label:'Provocatrice',           style:'warn'},
    {id:'ten_desorga',   label:'Désorganisée',           style:'warn'},
    {id:'ten_hypersoig', label:'Hyper-soignée',          style:''},
    {id:'ten_negligee',  label:'Totalement négligée',    style:'danger'},
  ],
  corpulence: [
    {id:'corp_normale',   label:'Corpulence normale',    style:''},
    {id:'corp_amaigriss', label:'Amaigrissement',        style:'warn'},
    {id:'corp_prise',     label:'Prise pondérale',       style:'warn'},
    {id:'corp_cachexie',  label:'Cachexie',              style:'danger'},
  ],
  fatigue: [
    {id:'fat_cernes',   label:'Cernes',                  style:'warn'},
    {id:'fat_ralent',   label:'Ralentissement visible',  style:'warn'},
    {id:'fat_posture',  label:'Posture affaissée',       style:'warn'},
  ],
  physique: [
    {id:'phy_cicatric',  label:'Cicatrices',             style:'warn'},
    {id:'phy_automut',   label:"Traces d'automutilation",style:'danger'},
    {id:'phy_trembl',    label:'Tremblements',           style:'warn'},
    {id:'phy_dyskinesie',label:'Dyskinésies',            style:'warn'},
    {id:'phy_dysarthrie',label:'Dysarthrie',             style:'warn'},
    {id:'phy_sueurs',    label:'Sueurs',                 style:'warn'},
    {id:'phy_agit',      label:'Agitation visible',      style:'warn'},
    {id:'phy_ecchy',     label:'Ecchymoses',             style:'warn'},
    {id:'phy_toxique',   label:'Signes de conso. toxique',style:'danger'},
  ],
  odeurs: [
    {id:'od_alcool',   label:"Odeur d'alcool",           style:'danger'},
    {id:'od_cannabis', label:'Odeur de cannabis',        style:'warn'},
    {id:'od_hygiene',  label:'Mauvaise hygiène',         style:'warn'},
    {id:'od_parfum',   label:'Parfum excessif',          style:'warn'},
  ],
  /* ── CONTACT INITIAL ── */
  contact_init: [
    {id:'ci_cooperant',  label:'Coopérant',              style:''},
    {id:'ci_mefiant',    label:'Méfiant',                style:'warn'},
    {id:'ci_hostile',    label:'Hostile',                style:'danger'},
    {id:'ci_calme',      label:'Calme',                  style:''},
    {id:'ci_euthym',     label:'Euthymique',             style:''},
    {id:'ci_adapte',     label:'Adapté',                 style:''},
    {id:'ci_familier',   label:'Familiarité excessive',  style:'warn'},
  ],
  distance: [
    {id:'di_froide',     label:'Distance froide',        style:'warn'},
    {id:'di_fusionnel',  label:'Fusionnelle',            style:'warn'},
    {id:'di_adhesive',   label:'Adhésive',               style:'warn'},
    {id:'di_evitante',   label:'Évitante',               style:'warn'},
  ],
  regard: [
    {id:'reg_fuyant',    label:'Regard fuyant',          style:'warn'},
    {id:'reg_fixe',      label:'Regard fixe',            style:'warn'},
    {id:'reg_percant',   label:'Regard perçant',         style:''},
    {id:'reg_absent',    label:'Regard absent',          style:'warn'},
    {id:'reg_hypervig',  label:'Hypervigilant',          style:'warn'},
  ],
  /* ── ATTITUDE PSYCHOMOTRICE ── */
  ralent: [
    {id:'ral_gestes',    label:'Gestes lents',           style:'warn'},
    {id:'ral_latence',   label:'Latence de réponse',     style:'warn'},
    {id:'ral_dimmouvt',  label:'Diminution des mouvements', style:'warn'},
    {id:'ral_voix',      label:'Voix monotone',          style:'warn'},
    {id:'ral_stupeur',   label:'Stupeur',                style:'danger'},
  ],
  agitation: [
    {id:'ag_assoir',   label:"Impossible de rester assis", style:'warn'},
    {id:'ag_deambul',  label:'Déambulation',             style:'warn'},
    {id:'ag_mouvts',   label:'Mouvements incessants',   style:'warn'},
    {id:'ag_tension',  label:'Tension corporelle',      style:'warn'},
    {id:'ag_manip',    label:"Manipulation d'objets",   style:'warn'},
  ],
  motrice: [
    {id:'mo_stereo',   label:'Stéréotypies',            style:'warn'},
    {id:'mo_manner',   label:'Maniérisme',              style:'warn'},
    {id:'mo_tics',     label:'Tics',                    style:'warn'},
    {id:'mo_grimaces', label:'Grimaces',                style:'warn'},
    {id:'mo_echopx',   label:'Échopraxie',              style:'warn'},
    {id:'mo_catalep',  label:'Catalepsie',              style:'danger'},
    {id:'mo_flex',     label:'Flexibilité cireuse',     style:'danger'},
    {id:'mo_oppact',   label:'Opposition active',       style:'danger'},
    {id:'mo_opppass',  label:'Opposition passive',      style:'warn'},
  ],
  gestuelle: [
    {id:'ge_pauvre',    label:'Gestuelle pauvre',       style:'warn'},
    {id:'ge_theatrale', label:'Théâtrale',              style:'warn'},
    {id:'ge_expansive', label:'Expansive',              style:'warn'},
    {id:'ge_defensive', label:'Défensive',              style:'warn'},
    {id:'ge_agressive', label:'Agressive',              style:'danger'},
    {id:'ge_desorga',   label:'Désorganisée',           style:'warn'},
  ],
  /* ── EXPRESSION ÉMOTIONNELLE ── */
  affect_obs: [
    {id:'aff_euthym',    label:'Euthymique',            style:''},
    {id:'aff_triste',    label:'Triste',                style:'warn'},
    {id:'aff_anxieux',   label:'Anxieux',               style:'warn'},
    {id:'aff_irritable', label:'Irritable',             style:'warn'},
    {id:'aff_labile',    label:'Labile',                style:'warn'},
    {id:'aff_exalte',    label:'Exalté',                style:'warn'},
    {id:'aff_emousse',   label:'Émoussé',               style:'warn'},
    {id:'aff_aplati',    label:'Aplati',                style:'warn'},
    {id:'aff_inapprop',  label:'Inapproprié',           style:'danger'},
    {id:'aff_discordant',label:'Discordant',            style:'danger'},
  ],
  reactiv: [
    {id:'re_normale',   label:'Réactivité normale',     style:''},
    {id:'re_exageree',  label:'Réactivité exagérée',    style:'warn'},
    {id:'re_diminuee',  label:'Réactivité diminuée',    style:'warn'},
    {id:'re_absente',   label:'Réactivité absente',     style:'danger'},
  ],
  concord: [
    {id:'co_concordant', label:'Affect concordant',             style:''},
    {id:'co_discordant', label:'Discordance affect/discours',   style:'danger'},
    {id:'co_neutre',     label:'Affect neutre/aplati',          style:'warn'},
  ],
  /* ── LANGAGE VERBAL ── */
  voix: [
    {id:'vo_ralenti',   label:'Débit ralenti',          style:'warn'},
    {id:'vo_accelere',  label:'Débit accéléré',         style:'warn'},
    {id:'vo_logorrh',   label:'Logorrhéique',           style:'warn'},
    {id:'vo_mutisme',   label:'Mutisme',                style:'danger'},
    {id:'vo_faible',    label:'Volume faible',          style:'warn'},
    {id:'vo_fort',      label:'Volume fort',            style:'warn'},
    {id:'vo_monotone',  label:'Prosodie monotone',      style:'warn'},
    {id:'vo_emphatic',  label:'Emphatique',             style:'warn'},
    {id:'vo_chuchotee', label:'Voix chuchotée',         style:'warn'},
  ],
  discours: [
    {id:'di_coherent',    label:'Discours cohérent',    style:''},
    {id:'di_tachypsy',    label:'Tachypsychie',         style:'warn'},
    {id:'di_bradypsy',    label:'Bradypsychie',         style:'warn'},
    {id:'di_barrage',     label:'Barrage',              style:'danger'},
    {id:'di_fuite',       label:'Fuite des idées',      style:'warn'},
    {id:'di_persever',    label:'Persévération',        style:'warn'},
    {id:'di_tangent',     label:'Pensée tangentielle',  style:'warn'},
    {id:'di_circumstan',  label:'Pensée circonstanciée',style:'warn'},
    {id:'di_desorga',     label:'Désorganisation',      style:'danger'},
    {id:'di_neolog',      label:'Néologismes',          style:'warn'},
  ],
  themes: [
    {id:'th_suicid',    label:'Idées suicidaires',      style:'danger'},
    {id:'th_mort',      label:'Idées de mort',          style:'danger'},
    {id:'th_culpab',    label:'Culpabilité',            style:'warn'},
    {id:'th_devalo',    label:'Dévalorisation',         style:'warn'},
    {id:'th_ruine',     label:'Idées de ruine',         style:'warn'},
    {id:'th_persecut',  label:'Persécution',            style:'danger'},
    {id:'th_megalo',    label:'Mégalomanie',            style:'warn'},
    {id:'th_hypocond',  label:'Hypocondrie',            style:'warn'},
    {id:'th_mystique',  label:'Idées mystiques',        style:'warn'},
    {id:'th_jalousie',  label:'Jalousie pathologique',  style:'warn'},
    {id:'th_somatic',   label:'Préoccupations somatiques',style:'warn'},
  ],
  delire: [
    {id:'de_intuitif',   label:'Méc. intuitif',         style:'danger'},
    {id:'de_hallucinat', label:'Méc. hallucinatoire',   style:'danger'},
    {id:'de_interpret',  label:'Méc. interprétatif',    style:'danger'},
    {id:'de_imaginatif', label:'Méc. imaginatif',       style:'warn'},
    {id:'de_critique_o', label:'Critique : oui',        style:''},
    {id:'de_critique_n', label:'Critique : non',        style:'danger'},
    {id:'de_systema_o',  label:'Systématisé : oui',     style:'warn'},
    {id:'de_systema_n',  label:'Systématisé : non',     style:'warn'},
    {id:'de_danger',     label:'Dangerosité du délire', style:'danger'},
  ],
  /* ── LANGAGE NON VERBAL ── */
  regard2: [
    {id:'r2_evitement',   label:'Évitement du regard',  style:'warn'},
    {id:'r2_hyperfixe',   label:'Hyperfixation',        style:'warn'},
    {id:'r2_surveillance',label:'Regard de surveillance',style:'warn'},
    {id:'r2_vide',        label:'Regard vide',          style:'warn'},
  ],
  mimique: [
    {id:'mi_figee',      label:'Mimique figée',         style:'warn'},
    {id:'mi_pauvre',     label:'Mimique pauvre',        style:'warn'},
    {id:'mi_hyperexp',   label:'Hyperexpressive',       style:'warn'},
    {id:'mi_discordante',label:'Discordante',           style:'danger'},
    {id:'mi_triste',     label:'Triste',                style:'warn'},
    {id:'mi_souriante',  label:'Souriante (inadéquate)',style:'warn'},
  ],
  posture: [
    {id:'po_fermee',   label:'Posture fermée',          style:'warn'},
    {id:'po_defensive',label:'Défensive',               style:'warn'},
    {id:'po_voutee',   label:'Voûtée',                  style:'warn'},
    {id:'po_rigide',   label:'Rigide',                  style:'warn'},
    {id:'po_envahiss', label:'Envahissante',            style:'warn'},
    {id:'po_prostr',   label:'Prostrée',                style:'danger'},
  ],
  interaction: [
    {id:'in_ecoute',    label:'Bonne écoute',           style:''},
    {id:'in_interrupt', label:'Interruptions fréquentes',style:'warn'},
    {id:'in_mefiance',  label:'Méfiance',               style:'warn'},
    {id:'in_seducteur', label:'Attitude séductrice',    style:'warn'},
    {id:'in_aggpass',   label:'Agressivité passive',    style:'warn'},
    {id:'in_hostilite', label:'Hostilité',              style:'danger'},
  ],
  /* ── FONCTIONS COGNITIVES ── */
  cogn_att: [
    {id:'ca_distract',  label:'Distractibilité',        style:'warn'},
    {id:'ca_diffsuiv',  label:'Difficile à suivre',     style:'warn'},
    {id:'ca_fatigue',   label:'Fatigabilité cognitive', style:'warn'},
    {id:'ca_hyper',     label:'Hyperprosexie',          style:'warn'},
  ],
  orient: [
    {id:'or_tps_ok',   label:'Orienté (temps)',         style:''},
    {id:'or_tps_non',  label:'Désorien. temporelle',    style:'danger'},
    {id:'or_lieu_ok',  label:"Orienté (espace)",        style:''},
    {id:'or_lieu_non', label:'Désorien. spatiale',      style:'danger'},
    {id:'or_pers_ok',  label:'Orienté (personne)',      style:''},
    {id:'or_pers_non', label:'Désorien. identitaire',   style:'danger'},
  ],
  memoire: [
    {id:'me_oublis',   label:'Oublis récents',          style:'warn'},
    {id:'me_confabu',  label:'Confabulations',          style:'warn'},
    {id:'me_trous',    label:'Trous mnésiques',         style:'warn'},
    {id:'me_antero',   label:'Amnésie antérograde',     style:'danger'},
    {id:'me_retro',    label:'Amnésie rétrograde',      style:'danger'},
  ],
  insight: [
    {id:'ins_absent',  label:'Insight absent',          style:'danger'},
    {id:'ins_partiel', label:'Insight partiel',         style:'warn'},
    {id:'ins_bon',     label:'Bon insight',             style:''},
    {id:'jug_altere',  label:'Jugement altéré',         style:'danger'},
    {id:'jug_adapte',  label:'Jugement adapté',         style:''},
    {id:'jug_conscient',label:'Conscience des conséquences',style:''},
  ],
  /* ── SYMPTÔMES PERCEPTIFS ── */
  halluc: [
    {id:'ha_auditives', label:'Halluc. auditives',      style:'danger'},
    {id:'ha_visuelles', label:'Halluc. visuelles',      style:'danger'},
    {id:'ha_cenest',    label:'Halluc. cénesthésiques', style:'warn'},
    {id:'ha_tactiles',  label:'Halluc. tactiles',       style:'danger'},
    {id:'ha_olfact',    label:'Halluc. olfactives',     style:'warn'},
    {id:'ha_hypnag',    label:'Hypnagogiques',          style:'warn'},
    {id:'ha_hypnomp',   label:'Hypnopompiques',         style:'warn'},
  ],
  halluc_ind: [
    {id:'hi_parleseul', label:'Parle seul',             style:'danger'},
    {id:'hi_ecoutvide', label:'Écoute dans le vide',    style:'danger'},
    {id:'hi_repvoix',   label:'Répond à des voix',      style:'danger'},
    {id:'hi_attecoute', label:"Attitudes d'écoute",     style:'warn'},
  ],
  diss_obs: [
    {id:'do_bizarre',    label:'Bizarrerie comportementale',style:'warn'},
    {id:'do_incoher',    label:'Incohérence',           style:'danger'},
    {id:'do_rupture',    label:'Rupture logique',       style:'danger'},
    {id:'do_discordaff', label:'Discordance affective', style:'danger'},
    {id:'do_deperso',    label:'Dépersonnalisation',    style:'warn'},
    {id:'do_derealisa',  label:'Déréalisation',         style:'warn'},
  ],
  /* ── ÉLÉMENTS RELATIONNELS ── */
  alliance: [
    {id:'al_bonne',      label:'Alliance bonne',        style:''},
    {id:'al_fragile',    label:'Alliance fragile',      style:'warn'},
    {id:'al_impossible', label:'Alliance impossible',   style:'danger'},
  ],
  soignant: [
    {id:'so_dependance', label:'Dépendance',            style:'warn'},
    {id:'so_defiance',   label:'Défiance',              style:'warn'},
    {id:'so_idealisa',   label:'Idéalisation',          style:'warn'},
    {id:'so_devalo',     label:'Dévalorisation',        style:'warn'},
    {id:'so_fusion',     label:'Relation fusionnelle',  style:'warn'},
  ],
  limites: [
    {id:'li_respect',    label:'Cadre respecté',        style:''},
    {id:'li_opposition', label:'Opposition',            style:'warn'},
    {id:'li_manipul',    label:'Manipulation',          style:'danger'},
    {id:'li_passage',    label:"Passages à l'acte",     style:'danger'},
  ],
  /* ── SIGNES D'ALERTE IMMÉDIATS ── */
  alert_suic: [
    {id:'as_idees_act',  label:'Idées suicidaires actives', style:'danger'},
    {id:'as_scenario',   label:'Scénario précis',           style:'danger'},
    {id:'as_acces_moy',  label:'Accès aux moyens létaux',   style:'danger'},
    {id:'as_desespoir',  label:'Désespoir massif',          style:'danger'},
    {id:'as_impulse',    label:'Impulsivité',               style:'danger'},
    {id:'as_resolu',     label:'Résolution apparente',      style:'danger'},
  ],
  alert_hetero: [
    {id:'ah_menaces',    label:'Menaces verbales',          style:'danger'},
    {id:'ah_tension',    label:'Tension croissante',        style:'danger'},
    {id:'ah_delireperse',label:'Délire persécutif',         style:'danger'},
    {id:'ah_agit_maj',   label:'Agitation majeure',         style:'danger'},
  ],
  /* ── TABLEAUX CLINIQUES FRÉQUENTS ── */
  tab_dep: [
    {id:'td_ralent',   label:'Ralentissement',            style:'warn'},
    {id:'td_voixmono', label:'Voix monotone',             style:'warn'},
    {id:'td_regard_tr',label:'Regard triste',             style:'warn'},
    {id:'td_culpab',   label:'Culpabilité',               style:'warn'},
    {id:'td_anhedon',  label:'Anhédonie',                 style:'warn'},
    {id:'td_posture',  label:'Posture affaissée',         style:'warn'},
    {id:'td_pleurs',   label:'Pleurs',                    style:'warn'},
  ],
  tab_manie: [
    {id:'tm_famil',    label:'Familiarité excessive',     style:'warn'},
    {id:'tm_euphorie', label:'Euphorie',                  style:'warn'},
    {id:'tm_agit',     label:'Agitation',                style:'warn'},
    {id:'tm_logorrh',  label:'Logorrhée',                style:'warn'},
    {id:'tm_fuite',    label:'Fuite des idées',          style:'warn'},
    {id:'tm_tenue',    label:'Tenue extravagante',       style:'warn'},
    {id:'tm_grandio',  label:'Grandiosité',              style:'warn'},
  ],
  tab_psy: [
    {id:'tp_bizarre',  label:'Bizarrerie',               style:'danger'},
    {id:'tp_discord',  label:'Discordance',              style:'danger'},
    {id:'tp_emousse',  label:'Affect émoussé',           style:'warn'},
    {id:'tp_ecoute',   label:"Attitudes d'écoute",       style:'warn'},
    {id:'tp_mutisme',  label:'Mutisme',                  style:'danger'},
    {id:'tp_repli',    label:'Repli autistique',         style:'danger'},
  ],
  tab_anx: [
    {id:'ta_hypervig', label:'Hypervigilance',           style:'warn'},
    {id:'ta_tension',  label:'Tension musculaire',       style:'warn'},
    {id:'ta_agit_p',   label:'Agitation psychomotrice',  style:'warn'},
    {id:'ta_evitement',label:'Évitement du regard',      style:'warn'},
    {id:'ta_trembl',   label:'Tremblements',             style:'warn'},
  ],
  tab_border: [
    {id:'tb_labilite', label:'Labilité émotionnelle',   style:'danger'},
    {id:'tb_impulse',  label:'Impulsivité',             style:'danger'},
    {id:'tb_abandon',  label:"Peur de l'abandon",       style:'warn'},
    {id:'tb_ideal_dev',label:'Idéalis. ↔ Dévalor.',     style:'danger'},
    {id:'tb_vide',     label:'Sentiment de vide',       style:'warn'},
  ],
};

const PRES_CONFIG = [
  {tab:'app',      label:'Apparence',        sections:[
    {key:'hygiene',      title:'Hygiène'},
    {key:'tenue',        title:'Tenue'},
    {key:'corpulence',   title:'Corpulence'},
    {key:'fatigue',      title:'Signes de fatigue'},
    {key:'physique',     title:'Particularités physiques'},
    {key:'odeurs',       title:'Odeurs'},
  ]},
  {tab:'contact',  label:'Contact',          sections:[
    {key:'contact_init', title:'Contact initial'},
    {key:'distance',     title:'Distance relationnelle'},
    {key:'regard',       title:'Regard'},
  ]},
  {tab:'psych',    label:'Psychomotricité',  sections:[
    {key:'ralent',       title:'Ralentissement'},
    {key:'agitation',    title:'Agitation'},
    {key:'motrice',      title:'Particularités motrices'},
    {key:'gestuelle',    title:'Gestuelle'},
  ]},
  {tab:'affect',   label:'Affect',           sections:[
    {key:'affect_obs',   title:'Affect observé'},
    {key:'reactiv',      title:'Réactivité émotionnelle'},
    {key:'concord',      title:'Concordance affect / discours'},
  ]},
  {tab:'lang',     label:'Langage verbal',   sections:[
    {key:'voix',         title:'Caractéristiques de la voix'},
    {key:'discours',     title:'Structure du discours'},
    {key:'themes',       title:'Contenu — Thèmes'},
    {key:'delire',       title:'Délire — mécanisme & critique'},
  ]},
  {tab:'nonverb',  label:'Non-verbal',       sections:[
    {key:'regard2',      title:'Regard (détail)'},
    {key:'mimique',      title:'Mimique faciale'},
    {key:'posture',      title:'Posture'},
    {key:'interaction',  title:'Interaction'},
  ]},
  {tab:'cogn',     label:'Cognitif',         sections:[
    {key:'cogn_att',     title:'Attention & Concentration'},
    {key:'orient',       title:'Orientation'},
    {key:'memoire',      title:'Mémoire'},
    {key:'insight',      title:'Insight & Jugement'},
  ]},
  {tab:'perc',     label:'Perceptif',        sections:[
    {key:'halluc',       title:'Types d\'hallucinations'},
    {key:'halluc_ind',   title:'Signes indirects'},
    {key:'diss_obs',     title:'Dissociation observée'},
  ]},
  {tab:'relat',    label:'Relationnel',      sections:[
    {key:'alliance',     title:'Alliance thérapeutique'},
    {key:'soignant',     title:'Rapport au soignant'},
    {key:'limites',      title:'Gestion des limites'},
  ]},
  {tab:'alert',    label:'⚠ Alertes',        sections:[
    {key:'alert_suic',   title:'Risque suicidaire — signes immédiats'},
    {key:'alert_hetero', title:'Risque hétéro-agressif'},
  ]},
  {tab:'tableau',  label:'Tableaux',         sections:[
    {key:'tab_dep',      title:'🔵 Dépression'},
    {key:'tab_manie',    title:'🟡 Manie / Hypomanie'},
    {key:'tab_psy',      title:'🟣 Psychose'},
    {key:'tab_anx',      title:'🟠 Trouble anxieux'},
    {key:'tab_border',   title:'🔴 Borderline'},
  ]},
];

const PRESCHIPCHECKED = {};

/* ── SENTENCE ENGINE (moteur de phrases) ── */
const SENTENCE_ENGINE = [
  {ids:['hyg_correcte','hyg_negligee','hyg_degradee'],build(sel){const m={hyg_correcte:'correcte',hyg_negligee:'négligée',hyg_degradee:'très dégradée'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Sur le plan hygiénique, la présentation est '+v.join(', ')+'.':''}},
  {ids:['ten_adaptee','ten_inadaptee','ten_extrav','ten_provoc','ten_desorga','ten_hypersoig','ten_negligee'],build(sel){const m={ten_adaptee:'adaptée',ten_inadaptee:'inadaptée',ten_extrav:'extravagante',ten_provoc:'provocatrice',ten_desorga:'désorganisée',ten_hypersoig:'hyper-soignée',ten_negligee:'totalement négligée'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La tenue est '+v.join(', ')+'.':''}},
  {ids:['corp_normale','corp_amaigriss','corp_prise','corp_cachexie'],build(sel){const m={corp_normale:'une corpulence dans la norme',corp_amaigriss:'un amaigrissement notable',corp_prise:'une prise pondérale',corp_cachexie:'un état de cachexie préoccupant'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Sur le plan morphologique, on note '+v.join(' et ')+'.':''}},
  {ids:['fat_cernes','fat_ralent','fat_posture'],build(sel){const m={fat_cernes:'des cernes marqués',fat_ralent:'un ralentissement visible',fat_posture:'une posture affaissée'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Des signes de fatigue sont objectivés : '+v.join(', ')+'.':''}},
  {ids:['phy_cicatric','phy_automut','phy_trembl','phy_dyskinesie','phy_dysarthrie','phy_sueurs','phy_agit','phy_ecchy','phy_toxique'],build(sel){const m={phy_cicatric:'des cicatrices',phy_automut:"des traces d'automutilation",phy_trembl:'des tremblements',phy_dyskinesie:'des dyskinésies',phy_dysarthrie:'une dysarthrie',phy_sueurs:'des sueurs',phy_agit:'une agitation visible',phy_ecchy:'des ecchymoses',phy_toxique:"des signes évocateurs d'une consommation toxique"};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'On relève par ailleurs '+v.join(', ')+'.':''}},
  {ids:['od_alcool','od_cannabis','od_hygiene','od_parfum'],build(sel){const m={od_alcool:"une odeur d'alcool",od_cannabis:"une odeur évocatrice de cannabis",od_hygiene:"une odeur témoignant d'un déficit d'hygiène",od_parfum:'un parfum excessivement présent'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"L'odorat note "+v.join(' et ')+'.':''}},
  {ids:['ci_cooperant','ci_mefiant','ci_hostile','ci_calme','ci_euthym','ci_adapte','ci_familier'],build(sel){const m={ci_cooperant:'coopérant',ci_mefiant:'méfiant',ci_hostile:'hostile',ci_calme:'calme',ci_euthym:'euthymique',ci_adapte:'adapté',ci_familier:"d'une familiarité excessive"};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Le contact initial est '+v.join(', ')+'.':''}},
  {ids:['di_froide','di_fusionnel','di_adhesive','di_evitante'],build(sel){const m={di_froide:'froide',di_fusionnel:'fusionnelle',di_adhesive:'adhésive',di_evitante:'évitante'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La distance relationnelle est '+v.join(', ')+'.':''}},
  {ids:['reg_fuyant','reg_fixe','reg_percant','reg_absent','reg_hypervig'],build(sel){const m={reg_fuyant:'fuyant',reg_fixe:'fixe',reg_percant:'perçant',reg_absent:'absent',reg_hypervig:'hypervigilant'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Le regard est '+v.join(', ')+'.':''}},
  {ids:['ral_gestes','ral_latence','ral_dimmouvt','ral_voix','ral_stupeur'],build(sel){const m={ral_gestes:'des gestes lents',ral_latence:'une latence de réponse allongée',ral_dimmouvt:'une diminution des mouvements spontanés',ral_voix:'une voix monotone',ral_stupeur:'un état stuporeux'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Un ralentissement psychomoteur est objectivé, avec '+v.join(', ')+'.':''}},
  {ids:['ag_assoir','ag_deambul','ag_mouvts','ag_tension','ag_manip'],build(sel){const m={ag_assoir:"l'impossibilité de rester assis",ag_deambul:'une déambulation',ag_mouvts:'des mouvements incessants',ag_tension:'une tension corporelle manifeste',ag_manip:"une manipulation constante d'objets"};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Une agitation psychomotrice est présente, caractérisée par '+v.join(', ')+'.':''}},
  {ids:['mo_stereo','mo_manner','mo_tics','mo_grimaces','mo_echopx','mo_catalep','mo_flex','mo_oppact','mo_opppass'],build(sel){const m={mo_stereo:'des stéréotypies',mo_manner:'un maniérisme',mo_tics:'des tics',mo_grimaces:'des grimaces',mo_echopx:'une échopraxie',mo_catalep:'une catalepsie',mo_flex:'une flexibilité cireuse',mo_oppact:'une opposition active',mo_opppass:'une opposition passive'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Des particularités motrices sont notées : '+v.join(', ')+'.':''}},
  {ids:['ge_pauvre','ge_theatrale','ge_expansive','ge_defensive','ge_agressive','ge_desorga'],build(sel){const m={ge_pauvre:'pauvre',ge_theatrale:'théâtrale',ge_expansive:'expansive',ge_defensive:'défensive',ge_agressive:'agressive',ge_desorga:'désorganisée'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La gestuelle est '+v.join(', ')+'.':''}},
  {ids:['aff_euthym','aff_triste','aff_anxieux','aff_irritable','aff_labile','aff_exalte','aff_emousse','aff_aplati','aff_inapprop','aff_discordant'],build(sel){const m={aff_euthym:'euthymique',aff_triste:'triste',aff_anxieux:'anxieux',aff_irritable:'irritable',aff_labile:'labile',aff_exalte:'exalté',aff_emousse:'émoussé',aff_aplati:'aplati',aff_inapprop:'inapproprié au contexte',aff_discordant:'discordant'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"L'affect observé est "+v.join(', ')+'.':''}},
  {ids:['re_normale','re_exageree','re_diminuee','re_absente'],build(sel){const m={re_normale:'normale',re_exageree:'exagérée',re_diminuee:'diminuée',re_absente:'absente'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La réactivité émotionnelle est '+v.join(', ')+'.':''}},
  {ids:['co_concordant','co_discordant','co_neutre'],build(sel){if(sel.includes('co_concordant'))return "L'affect est concordant au contenu du discours.";if(sel.includes('co_discordant'))return "On observe une discordance notable entre l'affect exprimé et le contenu du discours.";if(sel.includes('co_neutre'))return "L'affect apparaît neutre ou aplati.";return ''}},
  {ids:['vo_ralenti','vo_accelere','vo_logorrh','vo_mutisme','vo_faible','vo_fort','vo_monotone','vo_emphatic','vo_chuchotee'],build(sel){if(sel.includes('vo_mutisme'))return 'Un mutisme est observé.';const debit={vo_ralenti:'ralenti',vo_accelere:'accéléré',vo_logorrh:'logorrhéique'}[sel.find(s=>['vo_ralenti','vo_accelere','vo_logorrh'].includes(s))||'']||'';const vol={vo_faible:'faible',vo_fort:'fort',vo_chuchotee:'chuchotée'}[sel.find(s=>['vo_faible','vo_fort','vo_chuchotee'].includes(s))||'']||'';const pros=sel.includes('vo_monotone')?'monotone':sel.includes('vo_emphatic')?'emphatique':'';const p=[];if(debit)p.push('un débit '+debit);if(vol)p.push('un volume '+vol);if(pros)p.push('une prosodie '+pros);return p.length?'La voix se caractérise par '+p.join(', ')+'.':''}},
  {ids:['di_coherent','di_tachypsy','di_bradypsy','di_barrage','di_fuite','di_persever','di_tangent','di_circumstan','di_desorga','di_neolog'],build(sel){if(sel.includes('di_coherent')&&sel.length===1)return 'Le discours est cohérent, logique et bien organisé.';const m={di_tachypsy:'une tachypsychie',di_bradypsy:'une bradypsychie',di_barrage:'un barrage',di_fuite:'une fuite des idées',di_persever:'des persévérations',di_tangent:'une pensée tangentielle',di_circumstan:'une pensée circonstanciée',di_desorga:'une désorganisation du discours',di_neolog:'des néologismes'};const v=sel.filter(s=>m[s]).map(s=>m[s]);return v.length?'Le cours de la pensée révèle '+v.join(', ')+'.':''}},
  {ids:['th_suicid','th_mort','th_culpab','th_devalo','th_ruine','th_persecut','th_megalo','th_hypocond','th_mystique','th_jalousie','th_somatic'],build(sel){const m={th_suicid:'des idées suicidaires',th_mort:'des idées de mort',th_culpab:'une culpabilité envahissante',th_devalo:'une dévalorisation de soi',th_ruine:'des idées de ruine',th_persecut:'des idées de persécution',th_megalo:'des idées de mégalomanie',th_hypocond:'une hypocondrie',th_mystique:'des thèmes mystiques',th_jalousie:'une jalousie pathologique',th_somatic:'des préoccupations somatiques'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Le contenu du discours est marqué par '+v.join(', ')+'.':''}},
  {ids:['de_intuitif','de_hallucinat','de_interpret','de_imaginatif','de_critique_o','de_critique_n','de_systema_o','de_systema_n','de_danger'],build(sel){const mecan=sel.filter(s=>['de_intuitif','de_hallucinat','de_interpret','de_imaginatif'].includes(s));const mmap={de_intuitif:'intuitif',de_hallucinat:'hallucinatoire',de_interpret:'interprétatif',de_imaginatif:'imaginatif'};const critique=sel.includes('de_critique_o')?', critiqué':sel.includes('de_critique_n')?', non critiqué':'';const syst=sel.includes('de_systema_o')?', bien systématisé':sel.includes('de_systema_n')?', non systématisé':'';const danger=sel.includes('de_danger');if(!mecan.length&&!critique&&!syst)return '';let s='Un délire est présent';if(mecan.length)s+=', à mécanisme '+mecan.map(x=>mmap[x]).join(' et ');s+=critique+syst;if(danger)s+='. La dangerosité liée au délire est à évaluer en urgence';return s+'.'}},
  {ids:['r2_evitement','r2_hyperfixe','r2_surveillance','r2_vide'],build(sel){const m={r2_evitement:'évitant',r2_hyperfixe:'hyperfixé',r2_surveillance:'de surveillance',r2_vide:'vide'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Le regard est '+v.join(', ')+'.':''}},
  {ids:['mi_figee','mi_pauvre','mi_hyperexp','mi_discordante','mi_triste','mi_souriante'],build(sel){const m={mi_figee:'figée',mi_pauvre:'pauvre',mi_hyperexp:'hyperexpressive',mi_discordante:'discordante',mi_triste:'triste',mi_souriante:'inappropriément souriante'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La mimique faciale est '+v.join(', ')+'.':''}},
  {ids:['po_fermee','po_defensive','po_voutee','po_rigide','po_envahiss','po_prostr'],build(sel){const m={po_fermee:'fermée',po_defensive:'défensive',po_voutee:'voûtée',po_rigide:'rigide',po_envahiss:'envahissante',po_prostr:'prostrée'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'La posture corporelle est '+v.join(', ')+'.':''}},
  {ids:['in_ecoute','in_interrupt','in_mefiance','in_seducteur','in_aggpass','in_hostilite'],build(sel){const m={in_ecoute:'une bonne écoute',in_interrupt:'des interruptions fréquentes',in_mefiance:'de la méfiance',in_seducteur:'une attitude séductrice',in_aggpass:"de l'agressivité passive",in_hostilite:'une hostilité manifeste'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"L'interaction lors de l'entretien est caractérisée par "+v.join(', ')+'.':''}},
  {ids:['ca_distract','ca_diffsuiv','ca_fatigue','ca_hyper'],build(sel){const m={ca_distract:'une distractibilité',ca_diffsuiv:"une difficulté à suivre l'entretien",ca_fatigue:'une fatigabilité cognitive',ca_hyper:'une hyperprosexie'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Les fonctions attentionnelles montrent '+v.join(', ')+'.':''}},
  {ids:['or_tps_ok','or_tps_non','or_lieu_ok','or_lieu_non','or_pers_ok','or_pers_non'],build(sel){const issues=[];if(sel.includes('or_tps_non'))issues.push('temporellement');if(sel.includes('or_lieu_non'))issues.push("dans l'espace");if(sel.includes('or_pers_non'))issues.push('quant à son identité');if(issues.length)return 'Une désorientation est observée '+issues.join(', ')+'.';if(sel.some(s=>s.endsWith('_ok')))return "L'orientation dans le temps, l'espace et la personne est conservée.";return ''}},
  {ids:['me_oublis','me_confabu','me_trous','me_antero','me_retro'],build(sel){const m={me_oublis:'des oublis récents',me_confabu:'des confabulations',me_trous:'des trous mnésiques',me_antero:'une amnésie antérograde',me_retro:'une amnésie rétrograde'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Sur le plan mnésique, on relève '+v.join(', ')+'.':''}},
  {ids:['ins_absent','ins_partiel','ins_bon','jug_altere','jug_adapte','jug_conscient'],build(sel){const ins=sel.includes('ins_absent')?'totalement absent':sel.includes('ins_partiel')?'partiel':sel.includes('ins_bon')?'conservé':'';const jug=sel.includes('jug_altere')?'altéré':sel.includes('jug_adapte')?'adapté':'';const p=[];if(ins)p.push('un insight '+ins);if(jug)p.push('un jugement '+jug);if(sel.includes('jug_conscient'))p.push('une conscience des conséquences');return p.length?"L'évaluation métacognitive révèle "+p.join(' et ')+'.':''}},
  {ids:['ha_auditives','ha_visuelles','ha_cenest','ha_tactiles','ha_olfact','ha_hypnag','ha_hypnomp'],build(sel){const m={ha_auditives:'auditives',ha_visuelles:'visuelles',ha_cenest:'cénesthésiques',ha_tactiles:'tactiles',ha_olfact:'olfactives',ha_hypnag:'hypnagogiques',ha_hypnomp:'hypnopompiques'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Des hallucinations '+v.join(', ')+' sont rapportées ou objectivées.':''}},
  {ids:['hi_parleseul','hi_ecoutvide','hi_repvoix','hi_attecoute'],build(sel){const m={hi_parleseul:'parle seul',hi_ecoutvide:'écoute dans le vide',hi_repvoix:"répond à des voix inaudibles pour l'examinateur",hi_attecoute:"présente des attitudes d'écoute"};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"Signes indirects d'hallucinations : le patient "+v.join(', ')+'.':''}},
  {ids:['do_bizarre','do_incoher','do_rupture','do_discordaff','do_deperso','do_derealisa'],build(sel){const m={do_bizarre:'des bizarreries comportementales',do_incoher:'une incohérence',do_rupture:'des ruptures logiques',do_discordaff:'une discordance affective',do_deperso:'une dépersonnalisation',do_derealisa:'une déréalisation'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Des éléments dissociatifs sont observables : '+v.join(', ')+'.':''}},
  {ids:['al_bonne','al_fragile','al_impossible'],build(sel){const m={al_bonne:'bonne et opérationnelle',al_fragile:'fragile et à consolider',al_impossible:'impossible à établir dans ce contexte'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"L'alliance thérapeutique est "+v.join(', ')+'.':''}},
  {ids:['so_dependance','so_defiance','so_idealisa','so_devalo','so_fusion'],build(sel){const m={so_dependance:'une dépendance au soignant',so_defiance:'une défiance',so_idealisa:'une idéalisation',so_devalo:'une dévalorisation du soignant',so_fusion:'une relation fusionnelle'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Le rapport au soignant est marqué par '+v.join(' et ')+'.':''}},
  {ids:['li_respect','li_opposition','li_manipul','li_passage'],build(sel){if(sel.includes('li_respect')&&sel.length===1)return 'Le cadre thérapeutique est respecté.';const m={li_opposition:"une opposition au cadre",li_manipul:'des tentatives de manipulation',li_passage:"des passages à l'acte"};const v=sel.filter(s=>m[s]).map(s=>m[s]);return v.length?'La gestion des limites révèle '+v.join(', ')+'.':''}},
  {ids:['as_idees_act','as_scenario','as_acces_moy','as_desespoir','as_impulse','as_resolu'],build(sel){const m={as_idees_act:'des idées suicidaires actives',as_scenario:'un scénario précis',as_acces_moy:'un accès aux moyens létaux',as_desespoir:'un désespoir massif',as_impulse:'une impulsivité importante',as_resolu:'une résolution apparente (soulagement suspect)'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'ALERTE SUICIDAIRE : '+v.join(', ')+' sont présents. Évaluation urgente requise.':''}},
  {ids:['ah_menaces','ah_tension','ah_delireperse','ah_agit_maj'],build(sel){const m={ah_menaces:'des menaces verbales',ah_tension:'une tension croissante',ah_delireperse:'un délire persécutif engageant la dangerosité',ah_agit_maj:'une agitation majeure'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'RISQUE HÉTÉRO-AGRESSIF : '+v.join(', ')+' sont observés.':''}},
  {ids:['td_ralent','td_voixmono','td_regard_tr','td_culpab','td_anhedon','td_posture','td_pleurs'],build(sel){const m={td_ralent:'un ralentissement',td_voixmono:'une voix monotone',td_regard_tr:'un regard triste',td_culpab:'une culpabilité',td_anhedon:'une anhédonie',td_posture:'une posture affaissée',td_pleurs:'des pleurs'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"Tableau évocateur d'un épisode dépressif : "+v.join(', ')+'.':''}},
  {ids:['tm_famil','tm_euphorie','tm_agit','tm_logorrh','tm_fuite','tm_tenue','tm_grandio'],build(sel){const m={tm_famil:'une familiarité excessive',tm_euphorie:'une euphorie',tm_agit:'une agitation',tm_logorrh:'une logorrhée',tm_fuite:'une fuite des idées',tm_tenue:'une tenue extravagante',tm_grandio:'une grandiosité'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"Tableau évocateur d'un état maniaque : "+v.join(', ')+'.':''}},
  {ids:['tp_bizarre','tp_discord','tp_emousse','tp_ecoute','tp_mutisme','tp_repli'],build(sel){const m={tp_bizarre:'des bizarreries',tp_discord:'une discordance',tp_emousse:'un affect émoussé',tp_ecoute:"des attitudes d'écoute",tp_mutisme:'un mutisme',tp_repli:'un repli autistique'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?"Tableau suggestif d'une organisation psychotique : "+v.join(', ')+'.':''}},
  {ids:['ta_hypervig','ta_tension','ta_agit_p','ta_evitement','ta_trembl'],build(sel){const m={ta_hypervig:'une hypervigilance',ta_tension:'une tension musculaire',ta_agit_p:'une agitation psychomotrice',ta_evitement:"un évitement du contact visuel",ta_trembl:'des tremblements'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Tableau compatible avec un trouble anxieux : '+v.join(', ')+'.':''}},
  {ids:['tb_labilite','tb_impulse','tb_abandon','tb_ideal_dev','tb_vide'],build(sel){const m={tb_labilite:'une labilité émotionnelle',tb_impulse:'une impulsivité marquée',tb_abandon:"une peur de l'abandon",tb_ideal_dev:'des oscillations entre idéalisation et dévalorisation',tb_vide:'un sentiment de vide'};const v=sel.map(s=>m[s]).filter(Boolean);return v.length?'Tableau évoquant un fonctionnement borderline : '+v.join(', ')+'.':''}},
];

/* ================================================================
   PRÉSENTATION — FONCTIONS UI
   ================================================================ */
function buildPresentationTab() {
  var nav = document.getElementById('presTabNav');
  var panes = document.getElementById('presTabPanes');
  if (!nav || !panes) return;
  nav.innerHTML = '';
  panes.innerHTML = '';

  PRES_CONFIG.forEach(function(cfg, i) {
    var btn = document.createElement('button');
    btn.className = 'pres-tab-btn' + (i === 0 ? ' active' : '');
    btn.dataset.tab = cfg.tab;
    btn.innerHTML = cfg.label + ' <span class="tb" id="ptb_' + cfg.tab + '"></span>';
    btn.onclick = function() { switchPresTab(cfg.tab); };
    nav.appendChild(btn);

    var pane = document.createElement('div');
    pane.className = 'pres-tab-pane' + (i === 0 ? ' active' : '');
    pane.id = 'ptab-' + cfg.tab;

    cfg.sections.forEach(function(sec) {
      var chips = PRES_CHIPS[sec.key] || [];
      var secEl = document.createElement('div');
      secEl.className = 'pres-sec';
      secEl.innerHTML = '<div class="pres-sec-title">' + sec.title + '</div><div class="chip-grid" id="cpg-' + sec.key + '"></div>';
      pane.appendChild(secEl);
      var grid = secEl.querySelector('.chip-grid');
      chips.forEach(function(chip) {
        var el = document.createElement('span');
        var checked = !!PRESCHIPCHECKED[chip.id];
        el.className = 'chip' + (checked ? (' sel' + (chip.style === 'warn' ? ' sel-warn' : chip.style === 'danger' ? ' sel-danger' : '')) : '');
        el.textContent = chip.label;
        el.onclick = function() {
          PRESCHIPCHECKED[chip.id] = !PRESCHIPCHECKED[chip.id];
          var c = PRESCHIPCHECKED[chip.id];
          el.className = 'chip' + (c ? (' sel' + (chip.style === 'warn' ? ' sel-warn' : chip.style === 'danger' ? ' sel-danger' : '')) : '');
          updatePresPreview();
          updatePresTabBadge(cfg.tab);
        };
        grid.appendChild(el);
      });
    });
    panes.appendChild(pane);
  });
}

function switchPresTab(tab) {
  document.querySelectorAll('.pres-tab-btn').forEach(function(b) { b.classList.toggle('active', b.dataset.tab === tab); });
  document.querySelectorAll('.pres-tab-pane').forEach(function(p) { p.classList.toggle('active', p.id === 'ptab-' + tab); });
}

function updatePresTabBadge(tab) {
  var cfg = PRES_CONFIG.find(function(c) { return c.tab === tab; });
  if (!cfg) return;
  var ids = cfg.sections.reduce(function(acc, s) { return acc.concat((PRES_CHIPS[s.key] || []).map(function(c) { return c.id; })); }, []);
  var count = ids.filter(function(id) { return PRESCHIPCHECKED[id]; }).length;
  var tb = document.getElementById('ptb_' + tab);
  if (tb) { tb.textContent = count || ''; tb.style.display = count ? 'inline' : 'none'; }
  var btn = document.querySelector('[data-tab="' + tab + '"].pres-tab-btn');
  if (btn) btn.classList.toggle('has-sel', count > 0);
}

function updatePresPreview() {
  var selected = Object.keys(PRESCHIPCHECKED).filter(function(id) { return PRESCHIPCHECKED[id]; });
  var sentences = [];
  SENTENCE_ENGINE.forEach(function(rule) {
    var sel = rule.ids.filter(function(id) { return selected.includes(id); });
    if (!sel.length) return;
    var s = rule.build(sel);
    if (s) sentences.push(s);
  });
  var preview = document.getElementById('presPreview');
  if (!preview) return;
  if (sentences.length) {
    preview.classList.add('has-content');
    preview.textContent = sentences.join(' ');
  } else {
    preview.classList.remove('has-content');
    preview.textContent = "Cochez des \u00e9l\u00e9ments ci-dessus pour g\u00e9n\u00e9rer automatiquement la description\u2026";
  }
}

function buildPresTextForSynthesis() {
  var selected = Object.keys(PRESCHIPCHECKED).filter(function(id) { return PRESCHIPCHECKED[id]; });
  var sentences = [];
  SENTENCE_ENGINE.forEach(function(rule) {
    var sel = rule.ids.filter(function(id) { return selected.includes(id); });
    if (!sel.length) return;
    var s = rule.build(sel);
    if (s) sentences.push(s);
  });
  return sentences.join(' ');
}

/* ================================================================
   OVERRIDE generateSynthesis — synthèse locale enrichie
   ================================================================ */
async function generateSynthesis() {
  var btnGen = document.getElementById('btn-generate');
  var btnRegen = document.getElementById('btn-regen');
  if (btnGen) btnGen.disabled = true;
  if (btnRegen) btnRegen.disabled = true;

  goStep(5);
  var out = document.getElementById('synthesis-output');
  out.innerHTML = '<div class="spinner-wrap"><div class="spinner"></div><p style="color:var(--text2);font-size:14px">G\u00e9n\u00e9ration de la synth\u00e8se clinique en cours\u2026</p></div>';
  document.getElementById('btn-copy').style.display = 'none';
  document.getElementById('btn-print').style.display = 'none';
  var _pdfBtn = document.getElementById('btn-pdf'); if(_pdfBtn) _pdfBtn.style.display = 'none';
  document.getElementById('btn-reset').style.display = 'none';

  setTimeout(function() {
    try {
      var text = buildRichSynthesis();
      renderSynthesisText(text, out);
      document.getElementById('btn-copy').style.display = '';
      document.getElementById('btn-print').style.display = '';
      document.getElementById('btn-reset').style.display = '';
    } catch(e) {
      out.innerHTML = '<p style="color:var(--danger);padding:20px">Erreur : ' + e.message + '</p>';
    }
    if (btnGen) btnGen.disabled = false;
    if (btnRegen) btnRegen.disabled = false;
  }, 300);
}

function gv2(id) { var e = document.getElementById(id); if (!e) return ''; return (e.value !== undefined ? e.value : e.textContent || '').trim(); }
function hasv(x) { return x != null && String(x).trim().length > 0; }
function joinL(arr) {
  arr = (arr || []).filter(function(x) { return x != null && x !== ''; });
  if (!arr.length) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr[0] + ' et ' + arr[1];
  return arr.slice(0, -1).join(', ') + ' et ' + arr[arr.length - 1];
}

function buildRichSynthesis() {
  var sexe = gv2('p-sexe');
  var age = gv2('p-age');
  var nom = gv2('p-nom');
  var prenom = gv2('p-prenom');
  var estF = (sexe === 'Femme');
  var sujet = estF ? 'La patiente' : (sexe === 'Homme' ? 'Le patient' : 'Le/La patient(e)');
  var leP = estF ? 'la patiente' : 'le patient';
  var ee = estF ? 'e' : '';
  var imc = gv2('p-imc');
  var dateVal = gv2('p-date');
  var dateStr = dateVal ? new Date(dateVal).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'}) : '';

  var tabac = gv2('p-tabac'), alcool = gv2('p-alcool'), cannabis = gv2('p-cannabis');
  var cocaine = gv2('p-cocaine'), opiaces = gv2('p-opiaces'), bzd = gv2('p-bzd');
  var autres = gv2('p-autres'), sevrage = gv2('p-sevrage');
  var substLines = [];
  if (hasv(tabac)) substLines.push('tabac (' + tabac + ' cig/j)');
  if (hasv(alcool)) substLines.push('alcool (' + alcool + ' UI/j)');
  if (hasv(cannabis)) substLines.push('cannabis (' + cannabis + ')');
  if (hasv(cocaine)) substLines.push("coca\u00efne (" + cocaine + ')');
  if (hasv(opiaces)) substLines.push("opia\u00e9s (" + opiaces + ' mg/j)');
  if (hasv(bzd)) substLines.push("benzodiaz\u00e9pines (" + bzd + ' mg/j)');
  if (hasv(autres)) substLines.push(autres);

  var sympByCat = {};
  SYMPTOMS_DATA.forEach(function(s) {
    if (!state.selectedSymp[s.id]) return;
    if (!sympByCat[s.cat]) sympByCat[s.cat] = [];
    var int = state.intensities[s.id] ? {l:'l\u00e9ger', m:'mod\u00e9r\u00e9', h:'important'}[state.intensities[s.id]] : '';
    var sp = (state.specs[s.id] || []).join(', ');
    sympByCat[s.cat].push(s.name + (int ? ' (' + int + ')' : '') + (sp ? ' [' + sp + ']' : ''));
  });

  var rudScoreVal = Object.values(state.rudChecked).filter(Boolean).length;
  var rudLevelStr = rudScoreVal <= 3 ? 'faible' : rudScoreVal <= 6 ? 'mod\u00e9r\u00e9' : '\u00e9lev\u00e9';
  var rudItemsList = Object.entries(state.rudChecked).filter(function(e) { return e[1]; }).map(function(e) { return e[0]; });

  var SEC = '\u2500\u2500 ';
  var lines = [];

  // 1. INTRODUCTION
  var intro = sujet;
  if (hasv(nom) || hasv(prenom)) intro += ' ' + [prenom, nom].filter(Boolean).join(' ');
  if (hasv(age)) intro += ', \u00e2g\u00e9' + ee + ' de ' + age + ' ans';
  if (hasv(imc)) intro += ', IMC ' + imc + '\u00a0kg/m\u00b2';
  var socialCtx = [];
  var statut = gv2('p-statut'), enfants = gv2('p-enfants'), nbEnfants = gv2('p-nb-enfants'), profession = gv2('p-profession');
  if (hasv(statut)) socialCtx.push(statut);
  if (enfants === 'oui' && hasv(nbEnfants)) socialCtx.push(nbEnfants + ' enfant' + (parseInt(nbEnfants) > 1 ? 's' : ''));
  else if (enfants === 'non') socialCtx.push('sans enfant');
  if (hasv(profession)) socialCtx.push(profession);
  if (socialCtx.length) intro += ', ' + socialCtx.join(', ');
  intro += ', est re\u00e7u' + ee;
  if (hasv(dateStr)) intro += ' le ' + dateStr;
  intro += '.';
  lines.push(intro);
  lines.push('');

  // 2. PRÉSENTATION CLINIQUE
  var presText = buildPresTextForSynthesis();
  if (presText) {
    lines.push(SEC + 'PR\u00c9SENTATION LORS DE L\u2019ENTRETIEN');
    lines.push('');
    lines.push(presText);
    lines.push('');
  }

  // 3. ANTÉCÉDENTS
  var atcdMed = gv2('p-atcd-med'), atcdChir = gv2('p-atcd-chir'), atcdPsy = gv2('p-atcd-psy');
  var atcdFamPsy = gv2('p-atcd-fam-psy'), atcdFamSom = gv2('p-atcd-fam-som');
  if (hasv(atcdMed) || hasv(atcdChir) || hasv(atcdPsy) || hasv(atcdFamPsy) || hasv(atcdFamSom)) {
    lines.push(SEC + 'ANT\u00c9C\u00c9DENTS');
    lines.push('');
    if (hasv(atcdMed) || hasv(atcdChir)) lines.push('Sur le plan m\u00e9dico-chirurgical\u00a0: ' + [atcdMed, atcdChir].filter(hasv).join(' ; ') + '.');
    if (hasv(atcdPsy)) lines.push('Sur le plan psychiatrique personnel\u00a0: ' + atcdPsy + '.');
    if (hasv(atcdFamPsy)) lines.push('Ant\u00e9c\u00e9dents familiaux psychiatriques\u00a0: ' + atcdFamPsy + '.');
    if (hasv(atcdFamSom)) lines.push('Ant\u00e9c\u00e9dents familiaux somatiques\u00a0: ' + atcdFamSom + '.');
    lines.push('');
  }

  // 4. CONSOMMATIONS
  if (substLines.length) {
    lines.push(SEC + 'CONSOMMATIONS DE SUBSTANCES');
    lines.push('');
    lines.push('On note une consommation active ou r\u00e9cente de ' + joinL(substLines) + '.');
    if (sevrage === 'Oui') lines.push('Un sevrage est en cours au moment de l\u2019\u00e9valuation.');
    lines.push('');
  }

  // 5. HISTOIRE
  var histoire = gv2('p-histoire');
  if (hasv(histoire)) {
    lines.push(SEC + 'HISTOIRE DE LA MALADIE');
    lines.push('');
    lines.push(histoire.trim());
    lines.push('');
  }

  // 6. ÉVALUATION CLINIQUE
  var catKeys = Object.keys(sympByCat).filter(function(c) { return c && c !== 'Risque suicidaire' && c !== 'undefined'; });
  if (catKeys.length) {
    lines.push(SEC + '\u00c9VALUATION CLINIQUE');
    lines.push('');
    var phrases = [];
    catKeys.forEach(function(cat) {
      var terms = sympByCat[cat];
      var phrase = '';
      switch(cat) {
        case 'Comportement': phrase = 'Sur le plan comportemental, on rel\u00e8ve ' + joinL(terms); break;
        case 'Thymie': phrase = 'Sur le plan thymique, ' + leP + ' pr\u00e9sente ' + joinL(terms); break;
        case 'Affect': phrase = "L'\u00e9valuation affective met en \u00e9vidence " + joinL(terms); break;
        case 'Cognitif': phrase = 'Sur le plan cognitif, on objective ' + joinL(terms); break;
        case 'Attention': phrase = 'Les fonctions attentionnelles r\u00e9v\u00e8lent ' + joinL(terms); break;
        case 'Anxi\u00e9t\u00e9': phrase = 'La sph\u00e8re anxieuse est marqu\u00e9e par ' + joinL(terms); break;
        case 'Psychotique': phrase = 'La s\u00e9miologie psychotique comprend ' + joinL(terms); break;
        case 'Sommeil': phrase = 'Les troubles du sommeil se manifestent par ' + joinL(terms); break;
        case 'App\u00e9tit': phrase = 'Sur le plan alimentaire, on note ' + joinL(terms); break;
        case 'Addictions': phrase = 'La sph\u00e8re addictive est caract\u00e9ris\u00e9e par ' + joinL(terms); break;
        case 'Somatique': phrase = 'Les plaintes somatiques incluent ' + joinL(terms); break;
        case 'Relationnel': phrase = 'Le fonctionnement relationnel est alt\u00e9r\u00e9, avec ' + joinL(terms); break;
        case 'Jugement / Insight': phrase = "L'\u00e9valuation du jugement et de l'insight r\u00e9v\u00e8le " + joinL(terms); break;
        default: phrase = 'Concernant ' + cat.toLowerCase() + ', on note ' + joinL(terms);
      }
      phrases.push(phrase);
    });
    for (var i = 0; i < phrases.length; i += 3) {
      lines.push(phrases.slice(i, i + 3).join('. ') + '.');
    }
    lines.push('');
  }

  // 7. RISQUE SUICIDAIRE
  var suicideSyms = sympByCat['Risque suicidaire'];
  if (suicideSyms || rudScoreVal > 0) {
    lines.push(SEC + 'RISQUE SUICIDAIRE');
    lines.push('');
    if (suicideSyms) lines.push("L'\u00e9valuation du risque suicidaire r\u00e9v\u00e8le la pr\u00e9sence de " + joinL(suicideSyms) + '.');
    if (rudScoreVal > 0) {
      lines.push('Score RUD\u00a0: ' + rudScoreVal + '/27 \u2014 niveau ' + rudLevelStr + '.');
      var action = rudScoreVal <= 3
        ? 'Suivi ambulatoire renforc\u00e9 recommand\u00e9.'
        : rudScoreVal <= 6
        ? 'R\u00e9\u00e9valuation dans les 24\u201348h recommand\u00e9e. Discuter d\u2019un recours aux urgences psychiatriques si aggravation.'
        : 'Hospitalisation \u00e0 envisager en urgence. Alerter l\u2019\u00e9quipe soignante. Ne pas laisser le patient seul.';
      lines.push(action);
      if (rudItemsList.length) lines.push('Facteurs retenus\u00a0: ' + joinL(rudItemsList) + '.');
    }
    lines.push('');
  }

  // 8. HYPOTHÈSES DIAGNOSTIQUES
  var cats = Object.keys(sympByCat);
  var hints = [];
  if (cats.includes('Thymie') && cats.includes('Anxi\u00e9t\u00e9')) hints.push('\u00e9pisode d\u00e9pressif caract\u00e9ris\u00e9 avec comorbidit\u00e9 anxieuse');
  else if (cats.includes('Thymie')) hints.push('\u00e9pisode d\u00e9pressif caract\u00e9ris\u00e9 \u00e0 pr\u00e9ciser');
  if (cats.includes('Psychotique')) hints.push('\u00e9pisode psychotique \u00e0 caract\u00e9riser');
  if (cats.includes('Anxi\u00e9t\u00e9') && !cats.includes('Thymie')) hints.push('trouble anxieux \u00e0 pr\u00e9ciser');
  if (cats.includes('Addictions')) hints.push('comorbidit\u00e9 addictive');
  if (hints.length) {
    lines.push(SEC + 'HYPOTH\u00c8SES CLINIQUES');
    lines.push('');
    lines.push('Les \u00e9l\u00e9ments cliniques recueillis sont compatibles avec\u00a0: ' + joinL(hints) + '. Un bilan compl\u00e9mentaire et un suivi sp\u00e9cialis\u00e9 permettront d\u2019affiner la d\u00e9marche diagnostique.');
    lines.push('');
  }

  // 8b. FACTEURS DE RISQUES
  var riskLines = buildRiskFactorsText();
  if (riskLines.length) {
    lines.push(SEC + 'FACTEURS DE RISQUES IDENTIFIÉS');
    lines.push('');
    riskLines.forEach(function(l) { lines.push(l + '.'); });
    lines.push('');
  }

  // 9. CONCLUSION
  lines.push(SEC + 'CONCLUSION ET ORIENTATION');
  lines.push('');
  var concl = 'Au terme de cet entretien, ' + leP + ' pr\u00e9sente un tableau clinique';
  var desc = [];
  if (cats.includes('Anxi\u00e9t\u00e9') && cats.includes('Thymie')) desc.push('anxio-d\u00e9pressif');
  else if (cats.includes('Anxi\u00e9t\u00e9')) desc.push('\u00e0 pr\u00e9dominance anxieuse');
  else if (cats.includes('Thymie')) desc.push('\u00e0 pr\u00e9dominance d\u00e9pressive');
  if (cats.includes('Psychotique')) desc.push('avec composante psychotique');
  if (substLines.length) desc.push('dans un contexte de consommation de substances');
  if (cats.includes('Risque suicidaire') || rudScoreVal > 0) desc.push('avec un risque suicidaire \u00e9valu\u00e9 \u00e0 niveau ' + rudLevelStr);
  if (desc.length) concl += ' ' + desc.join(', ');
  concl += ". Une prise en charge pluridisciplinaire et un suivi rapproch\u00e9 sont pr\u00e9conis\u00e9s afin d'affiner la d\u00e9marche diagnostique et d'adapter le projet th\u00e9rapeutique.";
  lines.push(concl);

  return lines.join('\n');
}

function renderSynthesisText(text, out) {
  out.innerHTML = '';
  var DASH = '\u2500\u2500 ';
  var blocks = text.split('\n\n');
  blocks.forEach(function(block) {
    if (!block.trim()) return;
    var lines = block.split('\n');
    var div = document.createElement('div');
    div.className = 'synth-section';
    if (lines[0] && lines[0].startsWith(DASH)) {
      var title = document.createElement('div');
      title.className = 'synth-sec-title';
      title.textContent = lines[0].replace(DASH, '');
      div.appendChild(title);
      var body = document.createElement('div');
      body.className = 'synth-sec-body';
      body.contentEditable = 'true';
      body.textContent = lines.slice(1).join('\n').trim();
      div.appendChild(body);
    } else {
      var body = document.createElement('div');
      body.className = 'synth-sec-body';
      body.contentEditable = 'true';
      body.textContent = block.trim();
      div.appendChild(body);
    }
    out.appendChild(div);
  });
}

function copySynthesis() {
  var sections = document.querySelectorAll('.synth-section');
  var text = Array.from(sections).map(function(s) {
    var title = s.querySelector('.synth-sec-title');
    var body = s.querySelector('.synth-sec-body');
    return (title ? '\u2500\u2500 ' + title.textContent + '\n' : '') + (body ? body.textContent : '');
  }).join('\n\n');
  navigator.clipboard.writeText(text);
  var btn = document.getElementById('btn-copy');
  btn.textContent = '\u2713 Copi\u00e9';
  setTimeout(function() { btn.textContent = 'Copier'; }, 2000);
}

/* ── patch goStep ── */


/* ================================================================
   FACTEURS DE RISQUES DATA
   ================================================================ */
const RISK_FACTORS = [
  {
    id: 1,
    label: "Facteurs psychosociaux",
    color: "#3b82f6",
    hue: 215,
    sections: {
      "Événements de vie": ["Deuil","Séparation ou divorce","Rupture sentimentale","Départ d'un proche","Naissance ou arrivée d'un enfant","Retraite mal vécue","Déménagement","Migration ou exil","Procédure judiciaire"],
      "Difficultés relationnelles": ["Isolement social","Solitude affective","Rejet social","Conflits conjugaux","Conflits familiaux","Harcèlement","Violence conjugale","Violence intrafamiliale","Perte du soutien familial"],
      "Difficultés socio-économiques": ["Chômage","Perte d'emploi","Précarité financière","Endettement","Difficultés administratives","Perte du logement","Hébergement précaire","Exclusion sociale"],
      "Psychotraumatismes": ["Agression physique","Agression sexuelle","Viol","Maltraitance infantile","Négligence parentale","Harcèlement scolaire","Accident grave","Catastrophe naturelle","Guerre ou attentat","Exposition répétée à des événements traumatiques"]
    }
  },
  {
    id: 2,
    label: "Facteurs somatiques",
    color: "#10b981",
    hue: 160,
    sections: {
      "Maladies neurologiques": ["Épilepsie","Accident vasculaire cérébral","Traumatisme crânien","Tumeur cérébrale","Maladie de Parkinson","Maladie d'Alzheimer","Démences","Sclérose en plaques"],
      "Maladies endocriniennes et métaboliques": ["Hypothyroïdie","Hyperthyroïdie","Syndrome de Cushing","Maladie d'Addison","Diabète","Hypoglycémie","Hypercalcémie","Carences vitaminiques (B1, B9, B12, D)"],
      "Maladies chroniques invalidantes": ["Cancer","Insuffisance cardiaque","Insuffisance respiratoire","Insuffisance rénale","Polyarthrite rhumatoïde","Douleurs chroniques","VIH","Neurosyphilis","COVID-19 avec atteinte neuropsychiatrique"],
      "Troubles physiologiques": ["Insomnie chronique","Apnée du sommeil","Fatigue chronique","Dénutrition","Déshydratation","Douleur persistante","Période post-partum","Ménopause difficile"]
    }
  },
  {
    id: 3,
    label: "Facteurs toxiques et iatrogènes",
    color: "#f59e0b",
    hue: 38,
    sections: {
      "Substances psychoactives": ["Alcool","Cannabis","Cocaïne","Amphétamines","MDMA","Cathinones","Hallucinogènes","Opioïdes","Solvants"],
      "Sevrages": ["Sevrage alcoolique","Sevrage benzodiazépinique","Sevrage opioïde","Sevrage cannabique chez sujets vulnérables"],
      "Médicaments pouvant favoriser une décompensation": ["Corticothérapie","Interférons","Certains antiparkinsoniens","Certains antiépileptiques","Psychostimulants","Certains traitements hormonaux"]
    }
  },
  {
    id: 4,
    label: "Facteurs de vulnérabilité psychiatrique",
    color: "#8b5cf6",
    hue: 263,
    sections: {
      "Antécédents personnels": ["Trouble psychotique","Trouble bipolaire","Dépression récurrente","Trouble anxieux sévère","Trouble de la personnalité","Tentative de suicide antérieure"],
      "Antécédents familiaux": ["Schizophrénie","Trouble bipolaire","Dépression majeure","Suicide familial","Addictions familiales"],
      "Facteurs développementaux": ["Carences affectives précoces","Attachement insécure","Difficultés neurodéveloppementales","Handicap intellectuel","Troubles du spectre de l'autisme","TDAH"]
    }
  },
  {
    id: 5,
    label: "Signaux d'alerte de décompensation imminente",
    color: "#ef4444",
    hue: 0,
    sections: {
      "Signaux d'alerte": ["Arrêt du traitement","Rupture du suivi médical","Insomnie récente ou aggravée","Isolement croissant","Consommation accrue d'alcool ou de drogues","Irritabilité inhabituelle","Repli sur soi","Altération de l'hygiène","Baisse du fonctionnement social ou professionnel","Discours pessimiste ou désespéré","Apparition d'idées délirantes","Hallucinations","Désorganisation comportementale"]
    }
  }
];

/* ── Build Risk Factors UI ── */
function buildRiskFactors() {
  var container = document.getElementById("risk-factors-container");
  if (!container) return;
  if (container.dataset.built === "1") return; // already built
  container.dataset.built = "1";
  container.innerHTML = "";

  RISK_FACTORS.forEach(function(rf) {
    if (!state.riskScores[rf.id]) state.riskScores[rf.id] = 0;
    if (!state.riskChecked[rf.id]) state.riskChecked[rf.id] = {};

    var card = document.createElement("div");
    card.className = "risk-card";
    card.style.setProperty("--rf-color", rf.color);
    card.style.setProperty("--rf-hue", rf.hue);

    // Header
    var score = state.riskScores[rf.id] || 0;
    var headerHtml = '<div class="risk-header" onclick="toggleRiskCard(' + rf.id + ')">' +
      '<div class="risk-title"><span class="risk-dot" style="background:' + rf.color + '"></span>' + rf.label + '</div>' +
      '<div class="risk-score-wrap">' +
        '<div class="risk-gauge" id="rgauge-' + rf.id + '">' +
          buildGaugeDots(score) +
        '</div>' +
        '<span class="risk-score-num" id="rscore-' + rf.id + '">' + score + '</span>' +
        '<span class="risk-score-label">/10</span>' +
      '</div>' +
      '<span class="risk-chevron" id="rchev-' + rf.id + '">▾</span>' +
    '</div>';

    // Score slider
    var sliderHtml = '<div class="risk-slider-wrap">' +
      '<input type="range" min="0" max="10" value="' + score + '" class="risk-slider" id="rslider-' + rf.id + '" ' +
      'oninput="updateRiskScore(' + rf.id + ', this.value)" style="--rf-color:' + rf.color + '">' +
      '<div class="risk-slider-labels"><span>0</span><span>Faible (1-3)</span><span>Modéré (4-6)</span><span>Élevé (7-10)</span><span>10</span></div>' +
    '</div>';

    // Items sections
    var itemsHtml = '<div class="risk-items" id="ritems-' + rf.id + '">';
    Object.keys(rf.sections).forEach(function(secName) {
      itemsHtml += '<div class="risk-sec-title">' + secName + '</div>';
      itemsHtml += '<div class="risk-items-grid">';
      rf.sections[secName].forEach(function(item) {
        var checked = !!state.riskChecked[rf.id][item];
        var cid = "ritem-" + rf.id + "-" + item.replace(/[^a-zA-Z0-9]/g, "_");
        itemsHtml += '<label class="risk-item' + (checked ? " checked" : "") + '" id="' + cid + '">' +
          '<input type="checkbox"' + (checked ? " checked" : "") + ' onchange="toggleRiskItem(' + rf.id + ',\'' + item.replace(/'/g, "\\'") + '\',this)">' +
          '<span>' + item + '</span>' +
        '</label>';
      });
      itemsHtml += '</div>';
    });
    itemsHtml += '</div>';

    card.innerHTML = headerHtml + sliderHtml + itemsHtml;
    container.appendChild(card);
  });

  setTimeout(buildRadarChart, 50);
}

function buildGaugeDots(score) {
  var html = '';
  for (var i = 1; i <= 10; i++) {
    var active = i <= score;
    var cls = active ? (score <= 3 ? "dot-low" : score <= 6 ? "dot-med" : "dot-high") : "";
    html += '<span class="gauge-dot ' + cls + '"></span>';
  }
  return html;
}

function toggleRiskCard(id) {
  var items = document.getElementById("ritems-" + id);
  var chev = document.getElementById("rchev-" + id);
  if (!items) return;
  var open = items.classList.toggle("open");
  if (chev) chev.textContent = open ? "▴" : "▾";
}

function updateRiskScore(id, val) {
  state.riskScores[id] = parseInt(val);
  var gauge = document.getElementById("rgauge-" + id);
  var scoreNum = document.getElementById("rscore-" + id);
  if (gauge) gauge.innerHTML = buildGaugeDots(parseInt(val));
  if (scoreNum) scoreNum.textContent = val;
  // update radar slider visual
  var slider = document.getElementById("rslider-" + id);
  if (slider) slider.style.setProperty('--val', val);
  buildRadarChart();
}

function toggleRiskItem(rfId, item, cb) {
  if (!state.riskChecked[rfId]) state.riskChecked[rfId] = {};
  state.riskChecked[rfId][item] = cb.checked;
  var label = cb.closest("label");
  if (label) label.classList.toggle("checked", cb.checked);
}

function buildRiskFactorsText() {
  var lines = [];
  RISK_FACTORS.forEach(function(rf) {
    var score = state.riskScores[rf.id] || 0;
    if (score === 0) return;
    var level = score <= 3 ? "faible" : score <= 6 ? "modéré" : "élevé";
    var items = Object.keys(state.riskChecked[rf.id] || {}).filter(function(k) { return state.riskChecked[rf.id][k]; });
    var line = rf.label + " : score " + score + "/10 (niveau " + level + ")";
    if (items.length) line += ". Éléments retenus : " + items.join(", ");
    lines.push(line);
  });
  return lines;
}

/* ================================================================
   RADAR CHART — Facteurs de risques
   ================================================================ */
function buildRadarChart() {
  var canvas = document.getElementById('riskRadar');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var cx = W / 2, cy = H / 2;
  var R = Math.min(W, H) / 2 - 60;
  var N = RISK_FACTORS.length;
  var scores = RISK_FACTORS.map(function(rf) { return (state.riskScores[rf.id] || 0) / 10; });
  var colors = RISK_FACTORS.map(function(rf) { return rf.color; });
  var labels = RISK_FACTORS.map(function(rf) { return rf.label; });

  ctx.clearRect(0, 0, W, H);

  // Draw background grid rings
  for (var ring = 1; ring <= 5; ring++) {
    var rr = R * ring / 5;
    ctx.beginPath();
    for (var i = 0; i < N; i++) {
      var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
      var x = cx + rr * Math.cos(angle);
      var y = cy + rr * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(100,120,200,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Ring labels
    ctx.fillStyle = 'rgba(100,120,200,0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ring * 2, cx + 4, cy - rr + 4);
  }

  // Draw axes
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = 'rgba(100,120,200,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw filled polygon
  ctx.beginPath();
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    var r = R * scores[i];
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(79,124,255,0.18)';
  ctx.fill();
  ctx.strokeStyle = '#4f7cff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw dots at each axis point
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    var r = R * scores[i];
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = '#0a0d14';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Draw axis labels
  ctx.font = 'bold 11px "Outfit", sans-serif';
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    var lx = cx + (R + 42) * Math.cos(angle);
    var ly = cy + (R + 42) * Math.sin(angle);
    var score = Math.round(scores[i] * 10);
    var shortLabel = ['Psychosoc.', 'Somatiques', 'Toxiques', 'Vulnérabilité', 'Alertes'][i] || labels[i].substring(0,12);

    // Score badge
    ctx.beginPath();
    ctx.arc(lx, ly, 14, 0, 2 * Math.PI);
    ctx.fillStyle = colors[i];
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(score, lx, ly);

    // Label below badge
    var lx2 = cx + (R + 70) * Math.cos(angle);
    var ly2 = cy + (R + 70) * Math.sin(angle);
    ctx.fillStyle = '#9ba3bf';
    ctx.font = '10px "Outfit", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(shortLabel, lx2, ly2);
  }

  // Center total
  var total = scores.reduce(function(a, b) { return a + b; }, 0);
  var avg = (total / N * 10).toFixed(1);
  ctx.font = 'bold 20px "Outfit", sans-serif';
  ctx.fillStyle = '#e8eaf2';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(avg, cx, cy - 10);
  ctx.font = '10px "Outfit", sans-serif';
  ctx.fillStyle = '#5a6480';
  ctx.fillText('score moy.', cx, cy + 10);
}

function updateRadar() {
  buildRadarChart();
}


/* ── Export PDF ── */

/* ================================================================
   PRINT & PDF — synthèse uniquement
   ================================================================ */
function buildSynthesisHTML() {
  var sections = document.querySelectorAll("#synthesis-output .synth-section");
  if (!sections.length) return null;

  var nom    = (document.getElementById("p-nom")    || {}).textContent || (document.getElementById("p-nom")    || {}).value || "";
  var prenom = (document.getElementById("p-prenom") || {}).textContent || (document.getElementById("p-prenom") || {}).value || "";
  var age    = (document.getElementById("p-age")    || {}).value || "";
  var dateEl = document.getElementById("p-date");
  var dateStr = dateEl && dateEl.value
    ? new Date(dateEl.value).toLocaleDateString("fr-FR", {day:"2-digit", month:"long", year:"numeric"})
    : "";

  var header = "";
  if (nom || prenom || age || dateStr) {
    header = "<div class='doc-header'>";
    if (nom || prenom) header += "<div class='doc-patient'>" + [prenom, nom].filter(Boolean).join(" ") + (age ? ", " + age + " ans" : "") + "</div>";
    if (dateStr) header += "<div class='doc-date'>Entretien du " + dateStr + "</div>";
    header += "</div>";
  }

  var body = Array.from(sections).map(function(s) {
    var title = s.querySelector(".synth-sec-title");
    var bodyEl = s.querySelector(".synth-sec-body");
    var t = title ? "<h2>" + title.textContent + "</h2>" : "";
    var b = bodyEl ? "<p>" + (bodyEl.innerText || bodyEl.textContent || "").replace(/\n/g, "<br>") + "</p>" : "";
    return t + b;
  }).join("");

  return header + body;
}

function doPrint() {
  var content = buildSynthesisHTML();
  if (!content) { toast("Aucune synthèse générée.", "warn"); return; }

  var w = window.open("", "_blank");
  w.document.write(
    "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Synthèse Clinique</title>" +
    "<style>" +
      "@page { margin: 2.2cm 2cm; }" +
      "body { font-family: 'Times New Roman', Georgia, serif; font-size: 11.5pt; line-height: 1.9; color: #111; }" +
      ".doc-header { border-bottom: 2px solid #1a3a6a; padding-bottom: 10px; margin-bottom: 22px; }" +
      ".doc-patient { font-size: 13pt; font-weight: bold; color: #1a3a6a; }" +
      ".doc-date { font-size: 10pt; color: #555; margin-top: 3px; }" +
      "h1 { font-size: 13pt; text-align: center; color: #1a3a6a; margin-bottom: 22px; letter-spacing: .5px; }" +
      "h2 { font-size: 9.5pt; font-weight: 700; color: #1a3a6a; text-transform: uppercase; letter-spacing: .9px; " +
           "margin: 20px 0 5px; border-left: 3px solid #1a3a6a; padding-left: 8px; }" +
      "p { margin: 0 0 10px; text-align: justify; }" +
      "br + br { display: none; }" +
    "</style></head><body>" +
    "<h1>Synthèse Clinique Psychiatrique — Psydiag-Éval</h1>" +
    content +
    "</body></html>"
  );
  w.document.close();
  w.focus();
  setTimeout(function() { w.print(); }, 400);
}

function exportPDF() {
  var sections = document.querySelectorAll("#synthesis-output .synth-section");
  if (!sections.length) { toast("Aucune synth\u00e8se g\u00e9n\u00e9r\u00e9e.", "warn"); return; }

  // Use jsPDF if available, otherwise fallback to print dialog
  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    toast("G\u00e9n\u00e9ration PDF via impression…", "");
    doPrint();
    return;
  }

  var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  var pageW = 210, pageH = 297;
  var marginL = 20, marginR = 20, marginT = 25, marginB = 20;
  var contentW = pageW - marginL - marginR;
  var y = marginT;
  var pageNum = 1;

  function addPage() {
    doc.addPage();
    pageNum++;
    y = marginT;
    addHeader();
  }

  function checkY(needed) {
    if (y + needed > pageH - marginB) { addPage(); }
  }

  function addHeader() {
    // Top border line
    doc.setDrawColor(79, 124, 255);
    doc.setLineWidth(0.8);
    doc.line(marginL, 12, pageW - marginR, 12);
    // App name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(79, 124, 255);
    doc.text("PSYDIAG-\u00c9VAL", marginL, 9);
    // Date
    var now = new Date();
    var dateStr = now.toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'}) + ' \u2014 ' + now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(90, 100, 128);
    doc.text(dateStr, pageW - marginR, 9, {align:'right'});
    // Page number
    if (pageNum > 1) {
      doc.text("Page " + pageNum, pageW - marginR, pageH - 8, {align:'right'});
    }
    doc.setTextColor(232, 234, 242);
  }

  // First page header
  addHeader();

  // Logo area (text-based since we can't embed easily)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(79, 124, 255);
  doc.text("Psydiag", marginL, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(155, 163, 191);
  doc.text("Suite d'outils cliniques psychiatriques", marginL, y + 7);
  y += 18;

  // Document title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(232, 234, 242);
  doc.text("Synth\u00e8se Clinique Psychiatrique", pageW / 2, y, {align:'center'});
  y += 8;

  // Patient info line
  var nom = gv2('p-nom'), prenom = gv2('p-prenom'), age = gv2('p-age');
  var dateEl = document.getElementById('p-date');
  var dateConsult = dateEl && dateEl.value ? new Date(dateEl.value).toLocaleDateString('fr-FR', {day:'2-digit', month:'long', year:'numeric'}) : '';
  if (nom || prenom || age) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(155, 163, 191);
    var patientStr = [prenom, nom].filter(Boolean).join(' ');
    if (age) patientStr += ', ' + age + ' ans';
    if (dateConsult) patientStr += ' \u2014 Entretien du ' + dateConsult;
    doc.text(patientStr, pageW / 2, y, {align:'center'});
    y += 6;
  }

  // Separator line
  doc.setDrawColor(79, 124, 255);
  doc.setLineWidth(0.4);
  doc.line(marginL, y, pageW - marginR, y);
  y += 10;

  // Sections
  sections.forEach(function(sec) {
    var titleEl = sec.querySelector('.synth-sec-title');
    var bodyEl = sec.querySelector('.synth-sec-body');
    if (!titleEl && !bodyEl) return;

    var title = titleEl ? titleEl.textContent.trim() : '';
    var body = bodyEl ? (bodyEl.innerText || bodyEl.textContent || '').trim() : '';
    if (!title && !body) return;

    checkY(16);

    if (title) {
      // Section title bar
      doc.setFillColor(26, 32, 53);
      doc.roundedRect(marginL, y - 4, contentW, 9, 2, 2, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(79, 124, 255);
      doc.text(title.toUpperCase(), marginL + 3, y + 2);
      y += 10;
    }

    if (body) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(220, 225, 240);
      var lines = doc.splitTextToSize(body, contentW);
      lines.forEach(function(line) {
        checkY(6);
        doc.text(line, marginL, y);
        y += 5.5;
      });
      y += 4;
    }
  });

  // Footer line on last page
  doc.setDrawColor(79, 124, 255);
  doc.setLineWidth(0.4);
  doc.line(marginL, pageH - marginB + 5, pageW - marginR, pageH - marginB + 5);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(90, 100, 128);
  doc.text("Document g\u00e9n\u00e9r\u00e9 par Psydiag-\u00c9val \u2014 Outil d'aide \u00e0 la r\u00e9daction clinique. Ne constitue pas un acte m\u00e9dical.", pageW/2, pageH - marginB + 10, {align:'center'});
  doc.text("Page " + pageNum, pageW - marginR, pageH - marginB + 10, {align:'right'});

  // Download
  var nom2 = gv2('p-nom') || 'synthese';
  var dateStamp = new Date().toISOString().slice(0,10);
  doc.save('Psydiag_Synthese_' + nom2 + '_' + dateStamp + '.pdf');
  toast("PDF t\u00e9l\u00e9charg\u00e9 !", "success");
}




/* ================================================================
   CONTACT FORM — Psydiag-Éval
   ================================================================ */
function handleEvalContact(e) {
  e.preventDefault();
  var nom     = (document.getElementById('ec-nom')        || {}).value || '';
  var email   = (document.getElementById('ec-email')      || {}).value || '';
  var prof    = (document.getElementById('ec-profession') || {}).value || '';
  var sujet   = (document.getElementById('ec-sujet')      || {}).value || '';
  var message = (document.getElementById('ec-message')    || {}).value || '';
  var fb      = document.getElementById('eval-contact-feedback');
  var btn     = document.querySelector('#evalContactForm button[type="submit"]');

  if (!nom || !email || !sujet || !message) {
    if (fb) {
      fb.textContent = 'Veuillez remplir tous les champs obligatoires (*).';
      fb.style.display = 'block';
      fb.style.background = 'rgba(239,68,68,0.12)';
      fb.style.border = '1px solid rgba(239,68,68,0.3)';
      fb.style.color = '#ef4444';
    }
    return;
  }

  var subject = encodeURIComponent('[Psydiag-Éval] ' + sujet + ' — ' + nom);
  var body = encodeURIComponent(
    'Nom : ' + nom + '\n' +
    'Email : ' + email + '\n' +
    'Profession : ' + (prof || 'Non renseignée') + '\n' +
    'Sujet : ' + sujet + '\n\n' +
    'Message :\n' + message + '\n\n' +
    '---\nEnvoyé depuis Psydiag-Éval'
  );

  window.location.href = 'mailto:appli.psymulation@gmail.com?subject=' + subject + '&body=' + body;

  setTimeout(function() {
    if (fb) {
      fb.textContent = "Votre client de messagerie s’est ouvert. Envoyez le message pour finaliser votre demande.";
      fb.style.display = 'block';
      fb.style.background = 'rgba(34,197,94,0.12)';
      fb.style.border = '1px solid rgba(34,197,94,0.3)';
      fb.style.color = '#22c55e';
    }
    if (btn) btn.disabled = false;
  }, 1200);
}
