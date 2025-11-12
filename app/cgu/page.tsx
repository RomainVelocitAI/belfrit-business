import React from 'react';

export default function CguPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 belgium-bars pb-3 inline-block">
          Conditions Générales d'Utilisation
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site internet <strong>BelFrit Business</strong> accessible à l'adresse www.belfritbusiness.fr. En accédant à ce site, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          {/* Article 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 1 - Objet</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes CGU ont pour objet de définir les modalités et conditions d'utilisation du site BelFrit Business ainsi que les droits et obligations des utilisateurs dans ce cadre.
            </p>
          </section>

          {/* Article 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 2 - Mentions légales</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site BelFrit Business est édité par BelFrit Business, dont le siège social est situé à La Réunion, France.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Directeur de publication : Angelo Rapazzini<br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline">info@belfritbusiness.fr</a><br />
              Téléphone : <a href="tel:+262693659589" className="text-[#E31E24] hover:underline">+262 693 659 589</a>
            </p>
          </section>

          {/* Article 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 3 - Accès au site</h2>
            <p className="text-gray-700 leading-relaxed">
              L'accès au site BelFrit Business est gratuit. Certaines fonctionnalités sont réservées aux professionnels disposant d'un compte validé.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              BelFrit Business s'efforce de maintenir le site accessible en permanence, mais peut être amené à interrompre l'accès notamment pour des raisons de maintenance, sans que sa responsabilité puisse être engagée.
            </p>
          </section>

          {/* Article 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 4 - Création de compte professionnel</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              L'accès aux services professionnels nécessite la création d'un compte. Pour ce faire, vous devez :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Etre un professionnel disposant d'un numéro SIRET valide</li>
              <li>Fournir des informations exactes et à jour</li>
              <li>Transmettre les justificatifs demandés (KBIS, etc.)</li>
              <li>Créer un mot de passe sécurisé</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Vous êtes responsable de la confidentialité de vos identifiants et de toute utilisation faite de votre compte.
            </p>
          </section>

          {/* Article 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 5 - Utilisation du site</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Vous vous engagez à utiliser le site de manière conforme à sa destination et à ne pas :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Porter atteinte aux droits de BelFrit Business ou de tiers</li>
              <li>Diffuser des contenus illicites, diffamatoires ou contraires aux bonnes mœurs</li>
              <li>Tenter d'accéder de manière frauduleuse au système informatique</li>
              <li>Perturber le fonctionnement normal du site</li>
              <li>Utiliser le site à des fins commerciales non autorisées</li>
            </ul>
          </section>

          {/* Article 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 6 - Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble des éléments du site (textes, images, vidéos, logos, charte graphique, bases de données) est la propriété exclusive de BelFrit Business ou fait l'objet d'une autorisation d'utilisation.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Toute reproduction, représentation, modification, publication ou exploitation non autorisée du site ou de l'un de ses éléments, par quelque procédé que ce soit, est strictement interdite et constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </section>

          {/* Article 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 7 - Protection des données personnelles</h2>
            <p className="text-gray-700 leading-relaxed">
              Vos données personnelles sont traitées conformément à notre <a href="/politique-confidentialite" className="text-[#E31E24] hover:underline font-semibold">Politique de confidentialité</a> et au Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données vous concernant. Pour exercer ces droits, contactez-nous à <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline">info@belfritbusiness.fr</a>.
            </p>
          </section>

          {/* Article 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 8 - Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais certaines fonctionnalités du site pourraient alors être limitées.
            </p>
          </section>

          {/* Article 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 9 - Responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              BelFrit Business met tout en œuvre pour assurer la fiabilité des informations présentes sur le site, mais ne peut garantir l'exactitude, la complétude ou l'actualité de celles-ci.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              BelFrit Business ne saurait être tenu responsable :
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mt-4">
              <li>Des interruptions ou dysfonctionnements du site</li>
              <li>Des dommages directs ou indirects résultant de l'utilisation du site</li>
              <li>Du contenu des sites tiers vers lesquels pointent des liens hypertextes</li>
              <li>Des actes de malveillance ou tentatives d'intrusion</li>
            </ul>
          </section>

          {/* Article 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 10 - Liens hypertextes</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site peut contenir des liens vers des sites tiers. BelFrit Business n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              La création de liens hypertextes vers le site BelFrit Business est soumise à autorisation préalable écrite.
            </p>
          </section>

          {/* Article 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 11 - Modification des CGU</h2>
            <p className="text-gray-700 leading-relaxed">
              BelFrit Business se réserve le droit de modifier les présentes CGU à tout moment. Les nouvelles conditions seront applicables dès leur mise en ligne. Il vous appartient de consulter régulièrement la dernière version des CGU.
            </p>
          </section>

          {/* Article 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 12 - Droit applicable et juridiction</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          {/* Article 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article 13 - Nullité partielle</h2>
            <p className="text-gray-700 leading-relaxed">
              Si une ou plusieurs stipulations des présentes CGU sont tenues pour non valides ou déclarées comme telles en application d'une loi, d'un règlement ou à la suite d'une décision définitive d'une juridiction compétente, les autres stipulations garderont toute leur force et leur portée.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-[#E31E24]">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant ces CGU :<br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-[#E31E24] hover:underline font-semibold">info@belfritbusiness.fr</a><br />
              Téléphone : <a href="tel:+262693659589" className="text-[#E31E24] hover:underline font-semibold">+262 693 659 589</a><br />
              Adresse : BelFrit Business, La Réunion, France
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}
