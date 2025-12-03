import React from 'react';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 belgium-bars pb-3 inline-block">
          Mentions légales
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Editeur du site */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Editeur du site</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site <strong>BelFrit Business</strong> est édité par :<br />
              <strong>BelFrit Business</strong><br />
              SIRET : [À compléter]<br />
              Adresse : La Réunion, France<br />
              Téléphone : <a href="tel:+262693659589" className="text-belfrit-red hover:underline">+262 693 659 589</a><br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-belfrit-red hover:underline">info@belfritbusiness.fr</a>
            </p>
          </section>

          {/* Directeur de publication */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de publication</h2>
            <p className="text-gray-700 leading-relaxed">
              Le directeur de publication du site est <strong>Angelo Rapazzini</strong>.
            </p>
          </section>

          {/* Hébergement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong><br />
              340 S Lemon Ave #4133<br />
              Walnut, CA 91789<br />
              États-Unis
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble du contenu de ce site (textes, images, vidéos, logos, graphismes) est la propriété exclusive de BelFrit Business ou de ses partenaires. Toute reproduction, distribution, modification ou exploitation non autorisée de ce contenu est strictement interdite et peut faire l'objet de poursuites judiciaires.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Les marques et logos présents sur le site sont des marques déposées. Leur reproduction sans autorisation expresse est interdite.
            </p>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Protection des données personnelles</h2>
            <p className="text-gray-700 leading-relaxed">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse : <a href="mailto:info@belfritbusiness.fr" className="text-belfrit-red hover:underline">info@belfritbusiness.fr</a>
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour plus d'informations, consultez notre <a href="/politique-confidentialite" className="text-belfrit-red hover:underline font-semibold">Politique de confidentialité</a>.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Ce site utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visite. Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation de responsabilité</h2>
            <p className="text-gray-700 leading-relaxed">
              BelFrit Business s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              BelFrit Business décline toute responsabilité en cas d'interruption du site, de problèmes techniques, ou de dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.
            </p>
          </section>

          {/* Liens hypertextes */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Liens hypertextes</h2>
            <p className="text-gray-700 leading-relaxed">
              Le site peut contenir des liens vers d'autres sites internet. BelFrit Business n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
            </p>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
            <p className="text-gray-700 leading-relaxed">
              Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut d'accord amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-gray-50 p-6 rounded-lg border-l-4 border-belfrit-red">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h2>
            <p className="text-gray-700 leading-relaxed">
              Pour toute question concernant ces mentions légales, vous pouvez nous contacter :<br />
              Email : <a href="mailto:info@belfritbusiness.fr" className="text-belfrit-red hover:underline font-semibold">info@belfritbusiness.fr</a><br />
              Téléphone : <a href="tel:+262693659589" className="text-belfrit-red hover:underline font-semibold">+262 693 659 589</a>
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
