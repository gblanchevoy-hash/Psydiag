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
  {id:23,name:"Logorrh\u00e9e",cat:"Comportement",def:"Flot de paroles excessif avec contenu agressif ou hostile.",specs:["Anxieuse","Hostile","Diffluente"]},
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
  {id:188,name:"Syllogomanie",cat:"Comportement",def:"Accumulation pathologique compulsive d'objets sans utilité réelle, souvent associée à une incapacité à se défaire d'affaires, engendrant un encombrement sévère du lieu de vie et une détresse fonctionnelle significative."},
  {id:189,name:"Pens\u00e9es verbales",cat:"Comportement",def:"Ph\u00e9nom\u00e8ne cognitif au cours duquel la pens\u00e9e se pr\u00e9sente sous forme de langage interieur structur\u00e9, parfois intrusif ou difficile \u00e0 contr\u00f4ler, pouvant \u00eatre \u00e9gosyntonique ou \u00e9godystonique selon le contexte clinique."},
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
  if (n === 3) { buildRiskFactors(); setTimeout(buildRadarChart, 80); }
  if (n === 4) { /* synthese */ }
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

const PRES_TAB_COLORS = [
  {bg:'rgba(99,179,237,.12)', border:'rgba(99,179,237,.35)', text:'#63b3ed', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(154,117,234,.12)', border:'rgba(154,117,234,.35)', text:'#9a75ea', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(72,187,120,.12)', border:'rgba(72,187,120,.35)', text:'#48bb78', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(247,107,107,.12)', border:'rgba(247,107,107,.35)', text:'#f76b6b', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(246,173,85,.12)', border:'rgba(246,173,85,.35)', text:'#f6ad55', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(100,160,210,.12)', border:'rgba(100,160,210,.35)', text:'#64a0d2', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(56,178,172,.12)', border:'rgba(56,178,172,.35)', text:'#38b2ac', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(159,122,234,.12)', border:'rgba(159,122,234,.35)', text:'#9f7aea', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(237,137,54,.12)', border:'rgba(237,137,54,.35)', text:'#ed8936', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(239,68,68,.12)', border:'rgba(239,68,68,.35)', text:'#ef4444', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
  {bg:'rgba(210,180,80,.12)', border:'rgba(210,180,80,.35)', text:'#c9a227', icon:'<img src="data:image/png;base64,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" style="width:26px;height:26px;object-fit:contain;vertical-align:middle" alt="">'},
];
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
  {tab:'alert',    label:'Alertes',        sections:[
    {key:'alert_suic',   title:'Risque suicidaire — signes immédiats'},
    {key:'alert_hetero', title:'Risque hétéro-agressif'},
  ]},
  {tab:'tableau',  label:'Tableaux cliniques',         sections:[
    {key:'tab_dep',      title:'Dépression'},
    {key:'tab_manie',    title:'Manie / Hypomanie'},
    {key:'tab_psy',      title:'Psychose'},
    {key:'tab_anx',      title:'Trouble anxieux'},
    {key:'tab_border',   title:'Borderline'},
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
    var col = PRES_TAB_COLORS[i] || PRES_TAB_COLORS[0];
    btn.className = 'pres-tab-btn' + (i === 0 ? ' active' : '');
    btn.dataset.tab = cfg.tab;
    btn.dataset.colIdx = i;
    btn.style.setProperty('--ptab-bg', col.bg);
    btn.style.setProperty('--ptab-border', col.border);
    btn.style.setProperty('--ptab-text', col.text);
    btn.innerHTML = col.icon + ' ' + cfg.label + ' <span class="tb" id="ptb_' + cfg.tab + '"></span>';
    btn.onclick = (function(tab, color) { return function() {
      switchPresTab(tab);
      // Apply color to active tab
      document.querySelectorAll('.pres-tab-btn').forEach(function(b) {
        b.style.background = '';
        b.style.borderColor = '';
        b.style.color = '';
      });
      var activeBtn = document.querySelector('.pres-tab-btn.active');
      if (activeBtn) {
        var c = PRES_TAB_COLORS[activeBtn.dataset.colIdx] || col;
        activeBtn.style.background = c.bg;
        activeBtn.style.borderColor = c.border;
        activeBtn.style.color = c.text;
      }
    };})(cfg.tab, col);
    nav.appendChild(btn);

    var pane = document.createElement('div');
    pane.className = 'pres-tab-pane' + (i === 0 ? ' active' : '');
    pane.id = 'ptab-' + cfg.tab;

    cfg.sections.forEach(function(sec) {
      var chips = PRES_CHIPS[sec.key] || [];
      var secEl = document.createElement('div');
      secEl.className = 'pres-sec';
      secEl.innerHTML = '<div class="pres-sec-title" style="color:' + col.text + ';border-left:3px solid ' + col.text + ';padding-left:8px;font-weight:700">' + sec.title + '</div><div class="chip-grid" id="cpg-' + sec.key + '"></div>';
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

  goStep(4);
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
      var _pdfBtnShow = document.getElementById('btn-pdf');
      if (_pdfBtnShow) _pdfBtnShow.style.display = '';
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
  var poids = gv2('p-poids');
  var taille = gv2('p-taille');
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
  if (hasv(poids)) intro += ', poids ' + poids + '\u00a0kg';
  if (hasv(taille)) intro += ', taille ' + taille + '\u00a0cm';
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
    // Add any risk factor scores > 0
    var scoreLines = [];
    Object.keys(state.riskScores || {}).forEach(function(rfId) {
      var sc = state.riskScores[rfId];
      if (!sc || sc === 0) return;
      var rf = (typeof RISK_FACTORS !== 'undefined' ? RISK_FACTORS : []).find(function(r) { return r.id == rfId; });
      if (rf) scoreLines.push(rf.label + ' : ' + sc + '/10');
    });
    if (scoreLines.length) {
      lines.push('Scores d’intensité clinicien : ' + scoreLines.join(', ') + '.');
    }
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

  // Draw filled polygon — couleur vert→orange→rouge selon score moyen
  var avgScore = scores.reduce(function(a,b){return a+b;},0) / N; // 0..1
  var fillColor, strokeColor;
  if (avgScore <= 0.25) {
    fillColor = 'rgba(34,197,94,0.20)'; strokeColor = 'rgba(34,197,94,0.85)';
  } else if (avgScore <= 0.45) {
    fillColor = 'rgba(245,158,11,0.20)'; strokeColor = 'rgba(245,158,11,0.85)';
  } else if (avgScore <= 0.65) {
    fillColor = 'rgba(249,115,22,0.22)'; strokeColor = 'rgba(249,115,22,0.88)';
  } else if (avgScore <= 0.82) {
    fillColor = 'rgba(239,68,68,0.22)'; strokeColor = 'rgba(239,68,68,0.90)';
  } else {
    fillColor = 'rgba(153,27,27,0.28)'; strokeColor = 'rgba(220,38,38,0.95)';
  }

  ctx.beginPath();
  for (var i = 0; i < N; i++) {
    var angle = (i / N) * 2 * Math.PI - Math.PI / 2;
    var r = R * scores[i];
    var x = cx + r * Math.cos(angle);
    var y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
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
  var textEl = document.getElementById('synthesis-output');
  if (!textEl || !textEl.textContent.trim()) { toast("Aucune synth\u00e8se g\u00e9n\u00e9r\u00e9e.", "warn"); return; }

  var rawText = '';
  textEl.querySelectorAll('.synth-section').forEach(function(sec) {
    var title = sec.querySelector('.synth-title');
    var body  = sec.querySelector('.synth-body');
    if (title) rawText += '\n' + title.textContent.toUpperCase() + '\n' + '\u2500'.repeat(52) + '\n';
    if (body)  rawText += body.textContent + '\n';
  });
  if (!rawText.trim()) rawText = textEl.innerText || textEl.textContent;

  if (typeof window.jspdf === 'undefined' && typeof window.jsPDF === 'undefined') {
    var w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Synth\u00e8se \u00c9val</title>'
      + '<style>body{font-family:"Courier New",monospace;font-size:10pt;margin:2cm;line-height:1.6;color:#111}'
      + 'pre{white-space:pre-wrap}h1{font-size:13pt;color:#1a3a6a;margin-bottom:12px}</style></head><body>'
      + '<h1>Psydiag-\u00c9val \u2014 Synth\u00e8se Clinique</h1><pre>'
      + rawText.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></body></html>');
    w.document.close();
    setTimeout(function(){w.print();}, 400);
    return;
  }

  var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  var pageW = 210, pageH = 297;
  var marginL = 20, marginR = 20, marginT = 28, marginB = 22;
  var contentW = pageW - marginL - marginR;
  var y = marginT;
  var pageNum = 1;

  function addPageHeader() {
    doc.setDrawColor(15, 50, 120);
    doc.setLineWidth(0.8);
    doc.line(marginL, 14, pageW - marginR, 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 50, 120);
    doc.text("PSYDIAG-\u00c9VAL", marginL, 11);
    var now = new Date();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(80, 90, 110);
    doc.text(now.toLocaleDateString('fr-FR') + ' ' + now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), pageW - marginR, 11, {align:'right'});
    if (pageNum > 1) doc.text("Page " + pageNum, pageW - marginR, pageH - 10, {align:'right'});
  }

  function checkY(needed) {
    if (y + needed > pageH - marginB) { doc.addPage(); pageNum++; y = marginT; addPageHeader(); }
  }

  addPageHeader();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 50, 120);
  doc.text("Psydiag-\u00c9val", marginL, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 60, 80);
  doc.text("\u00c9valuation Psychiatrique et Clinique", marginL, y);
  y += 7;
  doc.setDrawColor(15, 50, 120);
  doc.setLineWidth(0.4);
  doc.line(marginL, y, pageW - marginR, y);
  y += 8;

  var lines = rawText.split('\n');
  lines.forEach(function(line) {
    checkY(7);
    var trimmed = line.trim();

    if (/^[A-Z\u00C0-\u00DC()\\/\-\s:,.]{4,}$/.test(trimmed) && trimmed.length > 3 && trimmed.length < 80
        && !trimmed.startsWith('\u2500') && !trimmed.startsWith('\u2550')
        && !trimmed.startsWith('\u25b8') && !trimmed.startsWith('\u2022')) {
      y += 2;
      doc.setFillColor(225, 235, 252);
      doc.roundedRect(marginL, y - 4, contentW, 8.5, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 50, 120);
      doc.text(trimmed, marginL + 4, y + 1);
      y += 10;
    } else if (trimmed.startsWith('\u25b8') || trimmed.startsWith('\u2023')) {
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(59, 100, 180);
      doc.text('\u203a ' + trimmed.replace(/^[\u25b8\u2023]\s*/, ''), marginL + 2, y);
      y += 7;
    } else if (/^[\u2500\u2550\-=]{3,}/.test(trimmed)) {
      doc.setDrawColor(180, 195, 220);
      doc.setLineWidth(0.25);
      doc.line(marginL + 2, y - 2, pageW - marginR - 2, y - 2);
      y += 2;
    } else if (trimmed === '') {
      y += 2.5;
    } else if (trimmed.startsWith('\u2022') || trimmed.startsWith('\u2019')) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(20, 20, 20);
      var bw = doc.splitTextToSize(trimmed.replace(/^[\u2022\u2019]\s*/, ''), contentW - 8);
      bw.forEach(function(wl, wi) { checkY(6); if (wi===0) doc.text('\u2022', marginL+2, y); doc.text(wl, marginL+8, y); y+=5.2; });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(20, 20, 20);
      var indent = (line.match(/^(\s+)/) || ['',''])[1].length;
      var xPos = marginL + Math.min(indent * 1.5, 16);
      var wrapped = doc.splitTextToSize(trimmed, contentW - (xPos - marginL));
      wrapped.forEach(function(wl) { checkY(6); doc.text(wl, xPos, y); y += 5.2; });
    }
  });

  doc.setDrawColor(15, 50, 120);
  doc.setLineWidth(0.3);
  doc.line(marginL, pageH - marginB + 3, pageW - marginR, pageH - marginB + 3);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(80, 90, 110);
  doc.text("G\u00e9n\u00e9r\u00e9 par Psydiag-\u00c9val \u2014 Outil d'aide clinique. Ne constitue pas un acte m\u00e9dical.", pageW/2, pageH - marginB + 8, {align:'center'});
  doc.text("Page " + pageNum, pageW - marginR, pageH - marginB + 8, {align:'right'});

  var dateStamp = new Date().toISOString().slice(0,10);
  doc.save('PsydiagEval_Synthese_' + dateStamp + '.pdf');
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
